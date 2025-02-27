import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "./Auth";
import Loading from "./Loading";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const authValues = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authValues) {
      navigate("/login");
    } else if (authValues.authLoading) {
      return;
    } else if (authValues.tokenExpired) {
      navigate("/sessionExpired");
    } else if (authValues.authValues && !authValues.authValues.user.verified) {
      navigate("/registerVerification", {
        state: {
          regDetails: {
            username:authValues.authValues.user.username,
            email: authValues.authValues.user.email
          }
        }
      });
    }
  }, [authValues, navigate]);

  if (!authValues) return null; // Prevent rendering anything until authValues are available
  if (authValues.authLoading) return <Loading message="Loading" />;
  
  return children;
};

