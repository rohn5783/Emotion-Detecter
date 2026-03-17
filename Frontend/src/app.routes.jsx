import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FaceExpression from "./features/Expression/Components/FaceExpression";
import ProtectedRoute from "./protected.routes.jsx";
import Dashboard from "./pages/Dashboard";
import Mood from "./pages/Mood";
import MoodifyDashboard from "./pages/IntroDashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mood",
    element: (
      <ProtectedRoute>
        <Mood />
      </ProtectedRoute>
    ),
  },
  {
    path: "/expression",
    element: (
      <ProtectedRoute>
        <FaceExpression />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <MoodifyDashboard />,
  },
]);

export default router;