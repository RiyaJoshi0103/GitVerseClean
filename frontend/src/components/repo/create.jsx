import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LockIcon, GlobeIcon } from "@primer/octicons-react";
import "./create.css";
import useAuth from "../../authContext";

const CreateRepository = () => {
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const [repoName, setRepoName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (success) setSuccess("");
  }, [repoName, description, visibility]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!repoName.trim()) {
        throw new Error("Repository name is required");
      }
      if (!isAuthenticated || !currentUser?._id) {
        throw new Error("Session expired. Please log in again");
      }

      const response = await fetch("http://localhost:3000/repo/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          owner: currentUser._id,
          name: repoName.trim(),
          description: description.trim(),
          visibility: visibility === "public",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create repository");
      }

      setSuccess("Repository created successfully!");
      setTimeout(() => navigate(`/repo/${data.repositoryId}`), 1500);
    } catch (err) {
      console.error("Repository creation error:", err);
      setError(err.message);
      if (
        err.message.toLowerCase().includes("session") ||
        err.message.toLowerCase().includes("authentic")
      ) {
        setTimeout(() => navigate("/login"), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="create-container">
        <div className="loading-spinner"></div>
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="create-container auth-required">
        <h2>Authentication Required</h2>
        <p>You need to be logged in to create repositories</p>
        <div className="auth-actions">
          <button onClick={() => navigate("/login")} className="btn-primary">
            Log In
          </button>
          <button onClick={() => navigate("/signup")} className="btn-secondary">
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-container">
      <div className="create-header">
        <h1>Create a new repository</h1>
        <p>
          A repository contains all project files, including revision history.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" aria-live="polite">
          <span className="close-btn" onClick={() => setError("")}>
            &times;
          </span>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" aria-live="polite">
          <span className="close-btn" onClick={() => setSuccess("")}>
            &times;
          </span>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group owner-group">
          <label>Owner</label>
          <div className="owner-select">{currentUser.username}</div>
          <span>/</span>
          <input
            type="text"
            name="repoName"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            required
            placeholder="repository-name"
            pattern="^[a-zA-Z0-9-_]+$"
            title="Only alphanumeric, hyphens and underscores allowed"
            className={
              error.toLowerCase().includes("name") ? "input-error" : ""
            }
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label>
            Description <span>(optional)</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description of your project"
          />
        </div>

        <div className="visibility-options">
          <div
            className={`visibility-option ${
              visibility === "private" ? "active" : ""
            }`}
            onClick={() => setVisibility("private")}>
            <LockIcon size={16} />
            <div>
              <h3>Private</h3>
              <p>Only you and collaborators can see this repository</p>
            </div>
          </div>
          <div
            className={`visibility-option ${
              visibility === "public" ? "active" : ""
            }`}
            onClick={() => setVisibility("public")}>
            <GlobeIcon size={16} />
            <div>
              <h3>Public</h3>
              <p>Anyone on the internet can see this repository</p>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isLoading || !repoName.trim()}
            className={`btn-primary ${isLoading ? "loading" : ""}`}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating...
              </>
            ) : (
              "Create repository"
            )}
          </button>
        </div>
      </form>

      <div className="create-footer">
        <h3>Quick setup</h3>
        <p>Get started by creating a new file or uploading an existing file.</p>
        <div className="code-snippet">
          <pre>
            {`git init\n`}
            {`git add .\n`}
            {`git commit -m "first commit"\n`}
            {`git branch -M main\n`}
            {`git remote add origin http://localhost:3000/${
              currentUser.username
            }/${repoName || "repository"}.git\n`}
            {`git push -u origin main`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CreateRepository;
