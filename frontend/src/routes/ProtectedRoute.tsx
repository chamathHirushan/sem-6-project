import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  isAllowed: boolean;
  requiredRoles?: string[];
  userRole?: string;
  redirectTo?: string;
};

export const ProtectedRoute = ({ 
  isAllowed, 
  requiredRoles = [], 
  userRole, 
  redirectTo = "/login" 
}: ProtectedRouteProps) => {

  if (!isAllowed) return <Navigate to={redirectTo} replace />;

  // Role check: if requiredRoles exist, check if userRole is included
  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole || "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
