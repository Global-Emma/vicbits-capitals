import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (user.role !== 'admin') {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;