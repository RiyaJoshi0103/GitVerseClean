import React from "react";
import { Navigate } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import Login from "./auth/Login";
import useAuth from "../authContext";

const HomeRoute = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // If not logged in, show login page at '/'
    return <Login />;
    // OR to redirect to /auth instead of rendering login here:
    // return <Navigate to="/auth" replace />;
  }

  // If logged in, show dashboard at '/'
  return <Dashboard />;
};

export default HomeRoute;
