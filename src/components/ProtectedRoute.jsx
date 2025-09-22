import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (Array.isArray(roles) && roles.length > 0) {
    const roleName = String(
      (user && user.role)).toLowerCase();
    const allowed = roles.map((r) => String(r).toLowerCase());
    if (!allowed.includes(roleName)) {
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
}