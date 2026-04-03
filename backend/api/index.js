import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import multer from 'multer';

const app = express();

app.use(cors());
app.use(express.json());

// Setup multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Middleware for Admin Authentication
const adminAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No authorization header' });
  const token = authHeader.split(' ')[1];
  if (token !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Forbidden. Incorrect password.' });
  }
  next();
};

// POST upload file
app.post('/api/upload', adminAuth, upload.single('logo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const filename = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Upload image to Supabase
    const { data, error } = await supabase.storage
      .from('app-logos')
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) throw error;

    // Get public URL
    const { data: publicData } = supabase.storage
      .from('app-logos')
      .getPublicUrl(filename);

    res.json({
      success: true,
      imageUrl: publicData.publicUrl,
      url: publicData.publicUrl
    });
  } catch (error) {
    console.error('Error uploading file to Supabase:', error.message);
    res.status(500).json({ error: 'Server error uploading file' });
  }
});

// GET all apps
app.get('/api/apps', async (req, res) => {
  try {
    const { data: apps, error } = await supabase
      .from('apps')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.json(apps);
  } catch (error) {
    console.error('Error fetching all apps:', error.message);
    res.status(500).json({ error: 'Server error fetching apps' });
  }
});

// GET recent 10 apps
app.get('/api/apps/recent', async (req, res) => {
  try {
    const { data: apps, error } = await supabase
      .from('apps')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    res.json(apps);
  } catch (error) {
    console.error('Error fetching recent apps:', error.message);
    res.status(500).json({ error: 'Server error fetching recent apps' });
  }
});

// POST add app (Admin only)
app.post('/api/apps', adminAuth, async (req, res) => {
  try {
    const { name, logo_url, download_link } = req.body;
    if (!name || !logo_url || !download_link) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: app, error } = await supabase
      .from('apps')
      .insert([{ name, logo_url, download_link }])
      .select();

    if (error) throw error;
    res.status(201).json(app[0]);
  } catch (error) {
    console.error('Error adding app:', error.message);
    res.status(500).json({ error: 'Server error adding app' });
  }
});

// DELETE app (Admin only)
app.delete('/api/apps/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('apps')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'App deleted successfully' });
  } catch (error) {
    console.error('Error deleting app:', error.message);
    res.status(500).json({ error: 'Server error deleting app' });
  }
});

// POST contact email
app.post('/api/contact', async (req, res) => {
  try {
    const { email, topic, message } = req.body;
    if (!email || !topic || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email
    await transporter.sendMail({
      from: `"${email}" <${email}>`, // sender address (from the form)
      to: process.env.SMTP_USER, // site admin email receiving the message
      subject: `MSU Games Contact: ${topic}`,
      text: `From: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`,
    });

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error.message);
    res.status(500).json({ error: 'Server error sending email', details: error.message });
  }
});

export default app;
