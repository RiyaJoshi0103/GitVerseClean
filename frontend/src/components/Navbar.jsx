import React from "react";
import { Link } from "react-router-dom";
import { MarkGithubIcon, PlusIcon, PersonIcon } from "@primer/octicons-react";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <MarkGithubIcon size={32} className="navbar-logo" />
          <span className="navbar-title">GitHub</span>
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/create" className="navbar-link">
          <PlusIcon size={16} className="navbar-icon" />
          <span>Create</span>
        </Link>
        <Link to="/profile" className="navbar-link">
          <PersonIcon size={16} className="navbar-icon" />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
