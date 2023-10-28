import useUser from "@/hooks/useUser";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUser();
  if (!user) {
    return <Navigate to={"/login"} />;
  }
  return children;
};

export default ProtectedRoute;
