import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  isAllowed: boolean;
  isLoggedIn?: boolean;
  redirectTo?: string;
};

export const ProtectedRoute = ({ 
  isAllowed,
  isLoggedIn = false,
  redirectTo = "/unauthorized" 
}: ProtectedRouteProps) => {

  if (!isLoggedIn) return <Navigate to={"/"} replace />;
  if (!isAllowed) return <Navigate to={redirectTo} replace />;

  return <Outlet />;
};
