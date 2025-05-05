// This will prevent authenticated users from accessing this route
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Loading from '../../common/Loading';

function OpenRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    // Redirect to dashboard if user is already authenticated
    const from = location.state?.from?.pathname || '/dashboard/my-profile';
    return <Navigate to={from} replace />;
  }

  return children;
}

export default OpenRoute;