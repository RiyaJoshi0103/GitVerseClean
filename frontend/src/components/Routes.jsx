// Routes.jsx
import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Dashboard from "./dashboard/Dashboard";
import Profile from "./user/Profile";
import CreateRepo from "./repo/create";
import  useAuth  from "../authContext";

// A wrapper for protected routes
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const ProjectRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Navigate to="/auth" replace />, // redirect root to login
    },
    {
      path: "/auth",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/create",
      element: (
        <ProtectedRoute>
          <CreateRepo />
        </ProtectedRoute>
      ),
    },
  ]);

  return routes;
};

export default ProjectRoutes;
