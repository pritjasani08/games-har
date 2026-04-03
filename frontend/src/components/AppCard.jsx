import React from 'react';
import { Download } from 'lucide-react';

const AppCard = ({ app }) => {
  return (
    <div className="app-card">
      <div className="app-card-header">
        <img src={app.logo_url} alt={`${app.name} logo`} className="app-logo" />
        <div className="app-info">
          <h3>{app.name}</h3>
        </div>
      </div>
      <div className="app-card-actions">
        <a href={app.download_link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          <Download size={18} />
          Download
        </a>
      </div>
    </div>
  );
};

export default AppCard;
