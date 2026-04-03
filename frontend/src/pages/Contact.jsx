import React, { useState } from 'react';
import { sendContactMessage } from '../api';
import './Contact.css';
import { Mail, MessageSquare, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ email: '', topic: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });
    try {
      await sendContactMessage(formData);
      setStatus({ type: 'success', msg: 'Message sent successfully! We will get back to you soon.' });
      setFormData({ email: '', topic: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', msg: 'Failed to send message. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container contact-container">
      <div className="contact-header">
        <h1 className="page-title">Get in Touch</h1>
        <p className="subtitle">Have a question or want to report an issue? Send us a message.</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-card">
            <Mail className="info-icon" size={32} />
            <h3>Email Us</h3>
            <p>support@msugames.com</p>
          </div>
          <div className="info-card">
            <MessageSquare className="info-icon" size={32} />
            <h3>Community</h3>
            <p>Join our Discord server for quick help</p>
          </div>
        </div>

        <div className="contact-form-wrapper">
          {status.msg && <div className={`status-alert ${status.type}`}>{status.msg}</div>}
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label>Your Email</label>
              <input 
                type="email" 
                className="input" 
                placeholder="you@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Topic</label>
              <select 
                className="input select-input"
                value={formData.topic}
                onChange={e => setFormData({...formData, topic: e.target.value})}
                required
              >
                <option value="" disabled>Select a topic</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="App Request">App Request</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea 
                className="input textarea" 
                rows="5"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
              <Send size={18} />
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
