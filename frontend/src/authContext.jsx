import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setCurrentUser(userId);
    }
    setLoading(false);
  }, []);

  const isAuthenticated = !!currentUser;

  const value = {
    currentUser,
    setCurrentUser,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Define the hook
const useAuth = () => {
  return useContext(AuthContext);
};

// Export default so import useAuth from ... works
export default useAuth;
