import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./Auth";
import Loading from "./Loading";


export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const authValues = useContext(AuthContext);

  if (authValues?.authLoading)
    return <Loading message="Loading" />;

  if (authValues?.authValues)
    return children;


  return <Navigate to="/login" replace />;

};
