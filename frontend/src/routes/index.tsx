import { useAuth } from "../contexts/AuthContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import Works from "../pages/user/Works";
import AdminAnalytics from "../pages/admin/AdminAnalytics";
import UnauthorizedPage from "../pages/Unauthorized";
import Users from "../pages/admin/Users";
import Hires from "../pages/user/Hires";
import MyJobs from "../pages/user/MyJobs";
import JobView from "../pages/user/JobView";
import Conversations from "../pages/user/Conversations";
import Analytics from "../pages/user/Analytics";
import MyFields from "../pages/user/MyFields";
import Fav from "../pages/user/Fav";
import Profile from "../pages/user/Profile";
import Layout from "../components/PageLayout";
import ServiceView from "../pages/user/ServiceView";

export function AppRouter() {
  const { user, userLoggedIn } = useAuth();

  const router = createBrowserRouter([
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/unauthorized", element: <UnauthorizedPage /> },
    {
      element: <Layout />,
      children: [
      {
        element: <ProtectedRoute isAllowed={userLoggedIn && user?.role >= 0} isLoggedIn={userLoggedIn} />,
        children: [
          { path: "/work", element: <Works /> },
          { path: "/work/:id", element: <JobView /> },
          { path: "/hire", element: <Hires /> },
          { path: "/hire/:id", element: <ServiceView /> },
          { path: "/my-jobs", element: <MyJobs /> },
          { path: "/conversations", element: <Conversations /> },
          { path: "/analytics", element: <Analytics /> },
          { path: "/job-fields", element: <MyFields /> },
          { path: "/favorites", element: <Fav /> },
          { path: "/profile", element: <Profile /> },
        ],
      },

      {
        element: <ProtectedRoute isAllowed={userLoggedIn && user?.role >= 3} isLoggedIn={userLoggedIn} />,
        children: [
          { path: "/admin", element: <AdminAnalytics /> },
          { path: "/users", element: <Users /> },
        ],
      },
      ]}
  ]);

  return <RouterProvider router={router} />;
}