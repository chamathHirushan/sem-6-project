import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/UserDashboard";
import AdminPage from "../pages/AdminDashboard";
import UnauthorizedPage from "../pages/Unauthorized";

// Authentication and role values
const isAuthenticated = false; // Set to `true` when logged in
const userRole: "user" | "admin" = "user"; // Change to "admin" for admin access

const publicRoutes = [
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
];

const userRoutes = [
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
];

const adminRoutes = [
  { path: "/admin", element: <AdminPage /> },
];

export const router = createBrowserRouter([
  ...publicRoutes,

  {
    element: <ProtectedRoute isAllowed={isAuthenticated} />,
    children: userRoutes.map((route) => ({
      path: route.path,
      element: route.element,
    })),
  },

  {
    element: (
      <ProtectedRoute
        redirectTo="/unauthorized"
        isAllowed={isAuthenticated && userRole === "admin"}
      />
    ),
    children: adminRoutes.map((route) => ({
      path: route.path,
      element: route.element,
    })),
  },
]);
