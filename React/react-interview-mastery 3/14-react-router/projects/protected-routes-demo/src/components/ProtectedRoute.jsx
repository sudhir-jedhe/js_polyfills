import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Layout-style guard: put every protected route underneath this as a
 * nested route (`<Route element={<ProtectedRoute />}>...</Route>`) rather
 * than wrapping each page individually.
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // preserve where the user was headed so LoginPage can send them back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
