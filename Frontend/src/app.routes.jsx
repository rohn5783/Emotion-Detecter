import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FaceExpression from "./features/Expression/Components/FaceExpression";
import protectedRoute from "./protected.routes.jsx";
const router = createBrowserRouter([
  {
    path: "/expression",
    element: (
      
      <protectedRoute>
        <FaceExpression />
        </protectedRoute>
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
    element: <Login />,
  },
]);

export default router;