import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthUser } from "@/hooks/useAuth";
import type { UserRole } from "@/api/authService";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: UserRole[];
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const user = useAuthUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

