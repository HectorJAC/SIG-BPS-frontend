import { Outlet, Navigate } from 'react-router-dom';
import { isAuthenticated } from './Auth';

export const ProtectedRoute = () => {
  if (isAuthenticated()) {
    return <Outlet />;
  } else {
    return <Navigate to='/login' />;
  }
};
