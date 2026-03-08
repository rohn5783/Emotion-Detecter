import { useAuth } from "./auth/Hooks/useAuth";
import { useNavigate } from "react-router";

  const protectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    navigate("/login");
  }

  return children;
};

export default protectedRoute;