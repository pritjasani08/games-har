import React, { useState, useEffect } from 'react';
import { getApps, addApp, deleteApp, uploadLogo } from '../api';
import './Admin.css';
import { Trash2, Plus, Lock } from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [apps, setApps] = useState([]);
  const [newApp, setNewApp] = useState({ name: '', download_link: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // For simplicity, we just save the password if it works for one request.
  // In a real app we'd get a token and store it.
  
  const handleLogin = (e) => {
    e.preventDefault();
    if(password.trim()) {
      setIsAuthenticated(true);
      fetchApps(password);
    }
  };

  const fetchApps = async (pw) => {
    try {
      const res = await getApps();
      setApps(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddApp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      let uploadedUrl = '';
      if (logoFile) {
        const uploadRes = await uploadLogo(logoFile, password);
        uploadedUrl = uploadRes.data.url;
      }
      
      if (!uploadedUrl) throw new Error("Logo upload failed");

      await addApp({ ...newApp, logo_url: uploadedUrl }, password);
      // Reset form
      setNewApp({ name: '', download_link: '' });
      setLogoFile(null);
      // Reset file input value
      document.getElementById('logoInput').value = '';
      fetchApps(password); // Refresh list
    } catch (err) {
      console.error("Failed to add app", err);
      if (err.response?.status === 403) setAuthError('Invalid Admin Password. Please reload to try again.');
      else setAuthError('Error: ' + (err.message || 'Failed to add app'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this app?')) return;
    try {
      await deleteApp(id, password);
      fetchApps(password);
    } catch (err) {
      console.error("Failed to delete", err);
      if (err.response?.status === 403) setAuthError('Invalid Admin Password.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-container auth-wrapper">
        <div className="auth-card">
          <div className="auth-icon-wrapper">
            <Lock size={32} className="auth-icon" />
          </div>
          <h2 className="section-title" style={{justifyContent: 'center'}}>Admin Access</h2>
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <input 
                type="password" 
                className="input" 
                placeholder="Enter Admin Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container container">
      <h1 className="page-title">Admin Dashboard</h1>
      
      {authError && <div className="error-alert">{authError}</div>}

      <div className="admin-content">
        {/* Add App Form */}
        <section className="admin-card">
          <h2 className="section-title"><Plus size={24}/> Add New App</h2>
          <form onSubmit={handleAddApp}>
            <div className="form-group">
              <label>App Name</label>
              <input 
                type="text" 
                className="input" 
                value={newApp.name}
                onChange={e => setNewApp({...newApp, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Logo Image</label>
              <input 
                type="file" 
                id="logoInput"
                accept="image/*"
                className="input" 
                onChange={e => setLogoFile(e.target.files[0])}
                required
              />
            </div>
            <div className="form-group">
              <label>Download Link</label>
              <input 
                type="url" 
                className="input" 
                value={newApp.download_link}
                onChange={e => setNewApp({...newApp, download_link: e.target.value})}
                placeholder="https://referral-link.com/..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add App'}
            </button>
          </form>
        </section>

        {/* List of Apps */}
        <section className="admin-card">
          <h2 className="section-title">Manage Apps</h2>
          <div className="app-list">
            {apps.map(app => (
              <div key={app.id} className="admin-app-item">
                <div className="app-item-info">
                   <img src={app.logo_url} alt="logo" className="small-logo" />
                   <span>{app.name}</span>
                </div>
                <button onClick={() => handleDelete(app.id)} className="btn btn-danger btn-sm">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            ))}
            {apps.length === 0 && <p className="text-muted">No apps available.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admin;
