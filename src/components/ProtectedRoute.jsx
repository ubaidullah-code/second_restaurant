import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isLogin, profileLoading } = useSelector((s) => s.auth);

  if (profileLoading) return <LoadingSpinner fullPage text="Authenticating..." />;
  if (!isLogin) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
