import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  isAllowed: boolean;
  requiredRoles?: string[];
  userRole?: string;
  redirectTo?: string;
};

export const ProtectedRoute = ({ 
  isAllowed, 
  redirectTo = "/unauthorized" 
}: ProtectedRouteProps) => {

  if (!isAllowed) return <Navigate to={redirectTo} replace />;

  return <Outlet />;
};
