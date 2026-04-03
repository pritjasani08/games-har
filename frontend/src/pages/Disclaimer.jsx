import React from 'react';

const Disclaimer = () => {
  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '800px' }}>
      <h1 className="page-title">Disclaimer</h1>
      <div className="content-card" style={{ 
        background: 'var(--card-bg)', 
        border: '1px solid var(--card-border)', 
        padding: '2rem', 
        borderRadius: '16px',
        lineHeight: '1.8'
      }}>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Last updated: April 01, 2026</p>
        
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Content Accuracy</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          The information and mobile applications provided on MSU Games are for general informational purposes only. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, apps, or related graphics contained on the website for any purpose.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)' }}>External Links</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Through this website, you are able to link to other websites which are not under the control of MSU Games. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
        </p>

       
      </div>
    </div>
  );
};

export default Disclaimer;
