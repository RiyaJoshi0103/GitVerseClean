import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import useAuth  from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    bio: "",
    location: "",
    website: "",
    company: "",
  });
  const { currentUser, setCurrentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      const localUsername = localStorage.getItem("username");

      // Set immediate fallback from localStorage if available
      if (localUsername && !userDetails.username) {
        setUserDetails((prev) => ({ ...prev, username: localUsername }));
      }

      if (userId) {
        try {
          setLoading(true);
          const response = await axios.get(
            `http://localhost:3000/user/userProfile/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          // Debug: Log API response
          console.log("User profile API response:", response.data);

          if (response.data) {
            setUserDetails(response.data);

            // Update auth context if needed
            if (!currentUser?.username && response.data.username) {
              setCurrentUser((prev) => ({
                ...prev,
                username: response.data.username,
              }));
            }
          }
        } catch (err) {
          console.error("Error fetching user details:", err);

          // Fallback to localStorage if API fails
          if (localUsername) {
            setUserDetails((prev) => ({ ...prev, username: localUsername }));
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserDetails();
  }, [currentUser, setCurrentUser]);

  // Debug: Show current state
  console.log("Current state:", {
    localStorageUsername: localStorage.getItem("username"),
    currentUser,
    userDetails,
    loading,
  });

  const displayUsername =
    userDetails.username ||
    currentUser?.username ||
    localStorage.getItem("username") ||
    "Guest";

  return (
    <div className="profile-container">
      <Navbar />

      <div className="profile-nav">
        <button className="nav-tab active" onClick={() => navigate("/profile")}>
          Overview
        </button>
        <button className="nav-tab" onClick={() => navigate("/repo")}>
          Repositories
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading profile...</div>
      ) : (
        <div className="profile-grid">
          {/* Left Column - User Profile */}
          <div className="profile-column user-profile">
            <div className="profile-card">
              <div className="avatar-container">
                <div className="avatar-image"></div>
              </div>

              <h1 className="username">{displayUsername}</h1>

              {userDetails.bio && <p className="user-bio">{userDetails.bio}</p>}
              <button className="follow-btn">Follow</button>

              <div className="user-details">
                {userDetails.location && (
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span>{userDetails.location}</span>
                  </div>
                )}
                {userDetails.website && (
                  <div className="detail-item">
                    <span className="detail-icon">🔗</span>
                    <a
                      href={userDetails.website}
                      target="_blank"
                      rel="noopener noreferrer">
                      {userDetails.website}
                    </a>
                  </div>
                )}
                {userDetails.company && (
                  <div className="detail-item">
                    <span className="detail-icon">🏢</span>
                    <span>{userDetails.company}</span>
                  </div>
                )}
              </div>

              <div className="social-stats">
                <Link to="/followers" className="stat-item">
                  <strong>10</strong> followers
                </Link>
                <Link to="/following" className="stat-item">
                  <strong>3</strong> following
                </Link>
              </div>
            </div>
          </div>

          {/* Middle Column - Contributions */}
          <div className="profile-column contributions">
            <div className="section-card">
              <h2>Contribution Activity</h2>
              <div className="heatmap-container">
                <HeatMapProfile />
              </div>
              <div className="contribution-stats">
                <span>1,024 contributions in the last year</span>
              </div>
            </div>
          </div>

          {/* Right Column - Repositories */}
          <div className="profile-column repositories">
            <div className="section-card">
              <h2>Popular Repositories</h2>
              <div className="repo-list">
                {[1, 2, 3].map((repo) => (
                  <div key={repo} className="repo-card">
                    <h3>
                      <Link to={`/${displayUsername}/repo-${repo}`}>
                        {displayUsername}/repo-{repo}
                      </Link>
                    </h3>
                    <p className="repo-description">
                      {repo === 1 && "Main project repository"}
                      {repo === 2 && "Documentation and guides"}
                      {repo === 3 && "Experimental features"}
                    </p>
                    <div className="repo-meta">
                      <span className="repo-language">JavaScript</span>
                      <span className="repo-stars">⭐ {repo * 5}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("username");
          setCurrentUser(null);
          window.location.href = "/auth";
        }}
        className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Profile;
