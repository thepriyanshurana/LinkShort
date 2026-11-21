
import { useEffect, useState } from "react";
import axios from "axios";

function Analytics({ url, onBack }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/analytics/${url._id}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        );

        setAnalytics(response.data);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Unable to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [url._id]);

  const renderStats = (stats) => {
    const entries = Object.entries(stats || {});

    if (entries.length === 0) {
      return <p>No data available yet.</p>;
    }

    return entries.map(([name, count]) => (
      <div className="link-item" key={name}>
        <div className="link-info">
          <strong>{name}</strong>
        </div>
        <span className="click-count">{count} clicks</span>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <h1>Loading analytics...</h1>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <h1>Analytics unavailable</h1>
          <p>{message}</p>
          <button className="auth-button" onClick={onBack}>
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <main className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          LINK ANALYTICS
        </div>

        <h1>
          Link <span>performance.</span>
        </h1>

        <p className="hero-description">
          Track how people interact with your shortened link.
        </p>

        <div className="preview-stats">
          <div className="stat-box">
            <span>Total clicks</span>
            <h2>{analytics.totalClicks}</h2>
            <small>All-time visits</small>
          </div>

          <div className="stat-box">
            <span>Recorded visits</span>
            <h2>{analytics.recentClicks.length}</h2>
            <small>Tracked click records</small>
          </div>
        </div>

        <button className="nav-signup" onClick={onBack}>
          ← Back to dashboard
        </button>
      </div>

      <div className="preview-card">
        <div className="preview-top">
          <div>
            <span className="preview-label">LINK DETAILS</span>
            <h3>{url.shortCode}</h3>
          </div>
          <div className="logo-icon">↗</div>
        </div>

        <div className="preview-links">
          <div className="preview-heading">
            <span>BROWSER STATS</span>
          </div>
          {renderStats(analytics.browsers)}

          <div className="preview-heading">
            <span>DEVICE STATS</span>
          </div>
          {renderStats(analytics.devices)}

          <div className="preview-heading">
            <span>COUNTRY STATS</span>
          </div>
          {renderStats(analytics.countries)}

          <div className="preview-heading">
            <span>RECENT CLICKS</span>
          </div>

          {analytics.recentClicks.length === 0 ? (
            <p>No clicks recorded yet.</p>
          ) : (
            analytics.recentClicks.map((click) => (
              <div className="link-item" key={click._id}>
                <div className="link-info">
                  <strong>
                    {click.browser} · {click.device}
                  </strong>
                  <small>{click.country}</small>
                  <small>
                    {new Date(click.clickedAt).toLocaleString()}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default Analytics;
