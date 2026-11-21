
import { useState } from "react";
import axios from "axios";
import Analytics from "./Analytics";
import QRCode from "./QRCode";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const [urls, setUrls] = useState([]);
  const [shortUrl, setShortUrl] = useState("");
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [selectedQrUrl, setSelectedQrUrl] = useState("");

  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Authentication config
  const getAuthConfig = () => {
    return {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    };
  };

  // Fetch user's links
  const fetchUserUrls = async () => {
    try {
      const response = await axios.get(
        "https://linkshort-backend-upje.onrender.com/my-links",
        getAuthConfig()
      );

      setUrls(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to fetch your links"
      );
    }
  };

  // Signup
  const handleSignup = async () => {
    if (!name || !email || !password) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(
        "https://linkshort-backend-upje.onrender.com/api/auth/signup",
        { name, email, password }
      );

      setMessage(response.data.message);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

  // Login
  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    try {
      const response = await axios.post(
        "https://linkshort-backend-upje.onrender.com/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", response.data.token);

      setUser(response.data.user);
      setPage("dashboard");
      setMessage("");

      setEmail("");
      setPassword("");

      await fetchUserUrls();
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  // Create short URL
  const handleCreateUrl = async () => {
    if (!originalUrl.trim()) {
      setMessage("Please enter a URL");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setShortUrl("");

      const response = await axios.post(
        "https://linkshort-backend-upje.onrender.com/create",
        {
          originalUrl: originalUrl,
          customAlias: customAlias.trim(),
          expiresAt: expiresAt || null
        },
        getAuthConfig()
      );

      setShortUrl(response.data.shortUrl);
      setOriginalUrl("");
      setCustomAlias("");
      setExpiresAt("");

      await fetchUserUrls();

      setMessage("Short link created successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to create short link"
      );
    } finally {
      setLoading(false);
    }
  };

  // Copy short URL
  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Link copied to clipboard!");
    } catch (error) {
      setMessage("Unable to copy link");
    }
  };

  // Delete short URL
  const handleDeleteUrl = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this link?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        "https://linkshort-backend-upje.onrender.com/" + id,
        getAuthConfig()
      );

      await fetchUserUrls();
      setMessage("Link deleted successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to delete link"
      );
    }
  };

  // Open analytics
  const handleAnalytics = (url) => {
    setSelectedUrl(url);
    setMessage("");
    setPage("analytics");
  };

  // Open QR code
  const handleQRCode = (url) => {
    setSelectedQrUrl(url);
    setMessage("");
    setPage("qrcode");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");

    setUser(null);
    setUrls([]);
    setSelectedUrl(null);
    setSelectedQrUrl("");
    setPage("home");
    setMessage("");
    setShortUrl("");
  };

  const totalClicks = urls.reduce((total, url) => {
    return total + url.clicks;
  }, 0);

  const today = new Date().toLocaleDateString("en-CA");

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div
          className="logo"
          onClick={() => {
            setMessage("");
            setPage(user ? "dashboard" : "home");
          }}
        >
          <div className="logo-icon">↗</div>
          <span>LinkShort</span>
        </div>

        <div className="nav-links">
          {user ? (
            <button className="nav-signup" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <button
                className="nav-login"
                onClick={() => {
                  setMessage("");
                  setPage("login");
                }}
              >
                Log in
              </button>

              <button
                className="nav-signup"
                onClick={() => {
                  setMessage("");
                  setPage("signup");
                }}
              >
                Get Started ↗
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HOME PAGE */}
      {page === "home" && (
        <main className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              SIMPLE. FAST. SMART.
            </div>

            <h1>
              Short links.
              <br />
              <span>Big possibilities.</span>
            </h1>

            <p className="hero-description">
              Transform long, messy URLs into clean, memorable links.
              Share smarter and keep everything organized in one place.
            </p>

            <div className="url-box">
              <span className="link-icon">↗</span>

              <input
                placeholder="Paste your long URL here..."
                onChange={(e) => setOriginalUrl(e.target.value)}
                value={originalUrl}
              />

              <button
                onClick={() => {
                  if (user) {
                    setMessage("");
                    setPage("create");
                  } else {
                    setMessage("");
                    setPage("login");
                  }
                }}
              >
                Shorten link →
              </button>
            </div>

            <div className="hero-note">
              <span>✦</span> Free to get started. No complicated setup.
            </div>
          </div>

          <div className="preview-card">
            <div className="preview-top">
              <div>
                <span className="preview-label">YOUR LINK DASHBOARD</span>
                <h3>Link overview</h3>
              </div>
              <div className="preview-menu">•••</div>
            </div>

            <div className="preview-stats">
              <div className="stat-box">
                <span>Total links</span>
                <h2>128</h2>
                <small>↗ Your link collection</small>
              </div>

              <div className="stat-box">
                <span>Total clicks</span>
                <h2>8.4k</h2>
                <small>↗ Link engagement</small>
              </div>
            </div>

            <div className="preview-links">
              <div className="preview-heading">
                <span>RECENT LINKS</span>
                <span>VIEW ALL →</span>
              </div>

              <div className="link-item">
                <div className="link-symbol">↗</div>
                <div className="link-info">
                  <strong>linkshort.in/design</strong>
                  <small>example.com/design-resources</small>
                </div>
                <span className="click-count">248 clicks</span>
              </div>

              <div className="link-item">
                <div className="link-symbol">↗</div>
                <div className="link-info">
                  <strong>linkshort.in/portfolio</strong>
                  <small>example.com/my-portfolio</small>
                </div>
                <span className="click-count">186 clicks</span>
              </div>

              <div className="link-item">
                <div className="link-symbol">↗</div>
                <div className="link-info">
                  <strong>linkshort.in/project</strong>
                  <small>example.com/my-project</small>
                </div>
                <span className="click-count">124 clicks</span>
              </div>
            </div>
          </div>

          <div className="hero-footer">
            <span>BUILT FOR BETTER SHARING</span>
            <span>YOUR LINKS, YOUR CONTROL.</span>
          </div>
        </main>
      )}

      {/* LOGIN PAGE */}
      {page === "login" && (
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="auth-icon">↗</div>
            <span className="auth-tag">WELCOME BACK</span>
            <h1>Good to see you.</h1>
            <p>Log in to manage your shortened links.</p>

            <label>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="auth-button" onClick={handleLogin}>
              Log in →
            </button>

            {message && <p>{message}</p>}

            <div className="auth-switch">
              New here?
              <span
                onClick={() => {
                  setMessage("");
                  setPage("signup");
                }}
              >
                {" "}Create an account
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SIGNUP PAGE */}
      {page === "signup" && (
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="auth-icon">↗</div>
            <span className="auth-tag">GET STARTED</span>
            <h1>Create your account.</h1>
            <p>Start creating shorter, smarter links today.</p>

            <label>Your name</label>
            <input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="auth-button" onClick={handleSignup}>
              Create account →
            </button>

            {message && <p>{message}</p>}

            <div className="auth-switch">
              Already have an account?
              <span
                onClick={() => {
                  setMessage("");
                  setPage("login");
                }}
              >
                {" "}Log in
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD PAGE */}
      {page === "dashboard" && user && (
        <main className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              YOUR DASHBOARD
            </div>

            <h1>
              Welcome back,
              <br />
              <span>{user.name}.</span>
            </h1>

            <p className="hero-description">
              Manage your links and track their performance
              from one place.
            </p>

            <div className="preview-stats">
              <div className="stat-box">
                <span>Total links</span>
                <h2>{urls.length}</h2>
                <small>Your created links</small>
              </div>

              <div className="stat-box">
                <span>Total clicks</span>
                <h2>{totalClicks}</h2>
                <small>Your link visits</small>
              </div>
            </div>

            <p className="hero-note">
              Logged in as {user.email}
            </p>

            <button
              className="nav-signup"
              onClick={() => {
                setMessage("");
                setShortUrl("");
                setOriginalUrl("");
                setCustomAlias("");
                setExpiresAt("");
                setPage("create");
              }}
            >
              + Create a short link
            </button>

            {message && <p className="hero-note">{message}</p>}
          </div>

          <div className="preview-card">
            <div className="preview-top">
              <div>
                <span className="preview-label">YOUR LINKS</span>
                <h3>Link collection</h3>
              </div>
              <div className="logo-icon">↗</div>
            </div>

            {urls.length === 0 ? (
              <div className="preview-links">
                <p className="hero-description">
                  You haven't created any links yet.
                </p>

                <button
                  className="nav-signup"
                  onClick={() => setPage("create")}
                >
                  Create your first link →
                </button>
              </div>
            ) : (
              <div className="preview-links">
                <div className="preview-heading">
                  <span>YOUR SHORT LINKS</span>
                  <span>{urls.length} LINKS</span>
                </div>

                {urls.map((url) => {
                  const shortLink =
                    "https://linkshort-backend-upje.onrender.com/" + url.shortCode;

                  return (
                    <div className="link-item" key={url._id}>
                      <div className="link-symbol">↗</div>

                      <div className="link-info">
                        <strong>{shortLink}</strong>
                        <small>{url.originalUrl}</small>
                        <small>{url.clicks} clicks</small>

                        <small>
                          {url.expiresAt
                            ? "Expires: " + new Date(url.expiresAt).toLocaleDateString()
                            : "No expiration"}
                        </small>
                      </div>

                      <button
                        className="nav-login"
                        onClick={() => handleCopy(shortLink)}
                      >
                        Copy
                      </button>

                      <button
                        className="nav-login"
                        onClick={() => handleAnalytics(url)}
                      >
                        Analytics
                      </button>

                      <button
                        className="nav-login"
                        onClick={() => handleQRCode(shortLink)}
                      >
                        QR Code
                      </button>

                      <button
                        className="nav-signup"
                        onClick={() => handleDeleteUrl(url._id)}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="hero-footer">
            <span>YOUR LINKS, YOUR CONTROL.</span>
            <span>{user.email}</span>
          </div>
        </main>
      )}

      {/* ANALYTICS PAGE */}
      {page === "analytics" && selectedUrl && (
        <Analytics
          url={selectedUrl}
          onBack={() => {
            setMessage("");
            setPage("dashboard");
          }}
        />
      )}

      {/* QR CODE PAGE */}
      {page === "qrcode" && selectedQrUrl && (
        <QRCode
          url={selectedQrUrl}
          onBack={() => {
            setMessage("");
            setPage("dashboard");
          }}
        />
      )}

      {/* CREATE LINK PAGE */}
      {page === "create" && (
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="auth-icon">↗</div>
            <span className="auth-tag">NEW SHORT LINK</span>
            <h1>Create a link.</h1>
            <p>Paste your long URL and get a shorter one.</p>

            <label>Original URL</label>
            <input
              type="text"
              placeholder="https://example.com/your-long-url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />

            <label>Custom alias (optional)</label>
            <input
              type="text"
              placeholder="e.g. my-portfolio"
              value={customAlias}
              maxLength={20}
              onChange={(e) => setCustomAlias(e.target.value)}
            />

            <small>
              Leave empty to generate a random short link.
              Use 3-20 letters, numbers, hyphens or underscores.
            </small>

            <label>Expiration date (optional)</label>
            <input
              type="date"
              value={expiresAt}
              min={today}
              onChange={(e) => setExpiresAt(e.target.value)}
            />

            <small>
              Leave empty if you want your link to stay active permanently.
            </small>

            <button
              className="auth-button"
              onClick={handleCreateUrl}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create short link →"}
            </button>

            {message && <p>{message}</p>}

            {shortUrl && (
              <div className="link-item">
                <div className="link-info">
                  <strong>{shortUrl}</strong>
                </div>

                <button
                  className="nav-login"
                  onClick={() => handleCopy(shortUrl)}
                >
                  Copy
                </button>
              </div>
            )}

            <div className="auth-switch">
              <span
                onClick={() => {
                  setMessage("");
                  setPage("dashboard");
                }}
              >
                ← Back to dashboard
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <span>© 2026 LinkShort</span>
        <span>Made for better links. ✦</span>
      </footer>

    </div>
  );
}

export default App;
