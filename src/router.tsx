import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/login";
import Manager from "@/pages/manager";
import Question from "@/pages/question";
import Answer from "@/pages/answer";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/main",
    element: (
      <ProtectedRoute>
        <Question />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Question />
      </ProtectedRoute>
    ),
  },
  {
    path: "/manager",
    element: (
      <ProtectedRoute>
        <Manager />
      </ProtectedRoute>
    ),
  },
  {
    path: "/answer",
    element: (
      <ProtectedRoute>
        <Answer />
      </ProtectedRoute>
    ),
  },
]);

export default router;
