import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    const fetchRepositories = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.warn("User ID not found in localStorage.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/repo/user/${userId}`
        );
        if (!response.ok) {
          console.warn("Repository fetch failed:", response.status);
          return;
        }

        const data = await response.json();
        setRepositories(data.repositories || []);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data);
      } catch (err) {
        console.error("Error while fetching suggested repositories: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);
  
  
  return (
    <>
      <Navbar />
      <section id="dashboard">
        <aside className="dashboard-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Suggested Repositories</h3>
            <div className="repo-list">
              {suggestedRepositories.map((repo) => {
                return (
                  <div key={repo._id} className="repo-item">
                    <h4 className="repo-name">{repo.name}</h4>
                    <p className="repo-description">{repo.description}</p>
                    <div className="repo-meta">
                      <span className="repo-language">JavaScript</span>
                      <span className="repo-stars">★ 12</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h2 className="dashboard-title">Your Repositories</h2>
            <div id="search" className="dashboard-search">
              <input
                type="text"
                value={searchQuery}
                placeholder="Find a repository..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <div className="repo-list">
            {searchResults.map((repo) => {
              return (
                <div key={repo._id} className="repo-item">
                  <h4 className="repo-name">{repo.name}</h4>
                  <p className="repo-description">{repo.description}</p>
                  <div className="repo-meta">
                    <span className="repo-language">JavaScript</span>
                    <span className="repo-stars">★ 5</span>
                    <span className="repo-updated">Updated 2 days ago</span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
        <aside className="dashboard-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Upcoming Events</h3>
            <ul className="events-list">
              <li className="event-item">
                <p className="event-title">Tech Conference</p>
                <p className="event-date">Dec 15, 2023</p>
              </li>
              <li className="event-item">
                <p className="event-title">Developer Meetup</p>
                <p className="event-date">Dec 25, 2023</p>
              </li>
              <li className="event-item">
                <p className="event-title">React Summit</p>
                <p className="event-date">Jan 5, 2024</p>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
