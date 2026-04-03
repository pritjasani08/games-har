import React, { useEffect, useState } from 'react';
import { getApps, getRecentApps } from '../api';
import AppCard from '../components/AppCard';
import { Sparkles, Library } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [recentApps, setRecentApps] = useState([]);
  const [allApps, setAllApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentRes, allRes] = await Promise.all([
          getRecentApps(),
          getApps()
        ]);
        setRecentApps(recentRes.data);
        setAllApps(allRes.data);
      } catch (err) {
        console.error("Failed to fetch apps", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-state">Loading amazing apps...</div>;
  }

  return (
    <div className="container home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">Discover The Best <br/><span className="highlight">Gaming Apps</span></h1>
        <p className="hero-subtitle">Download the latest and most popular games curated for you.</p>
      </section>

      {/* Recent Apps Section */}
      {recentApps.length > 0 && (
        <section className="app-section">
          <h2 className="section-title">
            <Sparkles className="icon-accent" size={28} />
            Recently Added
          </h2>
          <div className="app-grid">
            {recentApps.map(app => <AppCard key={app.id} app={app} />)}
          </div>
        </section>
      )}

      {/* All Apps Section */}
      <section className="app-section">
        <h2 className="section-title">
          <Library className="icon-accent" size={28} />
          All Apps
        </h2>
        {allApps.length === 0 ? (
          <p className="empty-state">No apps found yet. Check back soon!</p>
        ) : (
          <div className="app-grid">
            {allApps.map(app => <AppCard key={app.id} app={app} />)}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
