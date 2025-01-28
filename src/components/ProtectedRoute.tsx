import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./Auth";


export const ProtectedRoute = ({ children }: {children: React.ReactNode}) => {
  const authValues = useContext(AuthContext);
  if (authValues)
    return children;

  return <Navigate to="/login" replace />;

};
