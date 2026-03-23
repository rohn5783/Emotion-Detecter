import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./protected.routes.jsx";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const FaceExpression = lazy(() => import("./features/Expression/Components/FaceExpression"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Mood = lazy(() => import("./pages/Mood"));
const MoodSuggestions = lazy(() => import("./pages/MoodSuggestions"));
const Journal = lazy(() => import("./pages/Journal"));
const Sleep = lazy(() => import("./pages/Sleep"));
const Chat = lazy(() => import("./pages/Chat"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MoodifyDashboard = lazy(() => import("./pages/IntroDashboard.jsx"));

function RouteLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b1020",
        color: "#e5e7eb",
        fontWeight: 800,
      }}
    >
      Loading...
    </div>
  );
}

function withSuspense(element) {
  return <Suspense fallback={<RouteLoading />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: withSuspense(
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mood",
    element: withSuspense(
      <ProtectedRoute>
        <Mood />
      </ProtectedRoute>
    ),
  },
  {
    path: "/suggestions",
    element: withSuspense(
      <ProtectedRoute>
        <MoodSuggestions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/journal",
    element: withSuspense(
      <ProtectedRoute>
        <Journal />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sleep",
    element: withSuspense(
      <ProtectedRoute>
        <Sleep />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat",
    element: withSuspense(
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: "/expression",
    element: withSuspense(
      <ProtectedRoute>
        <FaceExpression />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: withSuspense(<Login />),
  },
  {
    path: "/register",
    element: withSuspense(<Register />),
  },
  {
    path: "/",
    element: withSuspense(<MoodifyDashboard />),
  },
  {
    path: "*",
    element: withSuspense(<NotFound />),
  },
]);

export default router;
