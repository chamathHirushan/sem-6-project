import { useAuth } from "../contexts/AuthContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/UserDashboard";
import AdminPage from "../pages/AdminDashboard";
import UnauthorizedPage from "../pages/Unauthorized";

export function AppRouter() {
  const { user, userLoggedIn } = useAuth();

  const router = createBrowserRouter([
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/unauthorized", element: <UnauthorizedPage /> },

    {
      element: <ProtectedRoute isAllowed={userLoggedIn && user?.role >= 1} isLoggedIn={userLoggedIn} />,
      children: [
        { path: "/dashboard", element: <DashboardPage /> },
      ],
    },

    {
      element: <ProtectedRoute isAllowed={userLoggedIn && user?.role >= 2} isLoggedIn={userLoggedIn} />,
      children: [
        { path: "/admin", element: <AdminPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}