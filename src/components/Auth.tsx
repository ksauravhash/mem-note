import { jwtDecode } from "jwt-decode";
import { createContext, ReactNode, useEffect, useState } from "react";
import axiosInstance from "../utility/axiosInstance";

export const AuthContext = createContext<{
  authValues?: AuthType;
  updateAuth: (authData: AuthType) => void;
  clearAuth: () => void;
  authLoading: boolean;
} | null>(null);
const authStorageName = "auth";

const Auth = ({ children }: { children?: ReactNode }) => {
  const [authValues, setAuthValues] = useState<AuthType>();
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const updateAuth = (authData: AuthType) => {
    localStorage.setItem(authStorageName, JSON.stringify(authData));
    setAuthValues(authData);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${authData?.accessToken}`;
  };

  const clearAuth = () => {
    localStorage.removeItem(authStorageName);
    setAuthValues(undefined);
  };

  useEffect(() => {
    setAuthLoading(true);
    const authObString = localStorage.getItem(authStorageName);
    if (authObString) {
      const authOb: AuthType | undefined = JSON.parse(authObString);
      try {
        if (authOb) {
          const secondsNow = Math.floor(Date.now()) / 1000;
          const refreshTokenExpSeconds = jwtDecode(authOb?.accessToken)?.exp;
          if (
            refreshTokenExpSeconds &&
            refreshTokenExpSeconds - secondsNow > 0
          ) {
            const accessTokenExpSeconds = jwtDecode(authOb?.accessToken)?.exp;
            if (
              accessTokenExpSeconds &&
              accessTokenExpSeconds - secondsNow > 0
            ) {
              axiosInstance.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${authOb?.accessToken}`;
              setAuthValues(authOb);
            } else {
              clearAuth();
            }
          } else {
            clearAuth();
          }
        }
      } catch (err) {
        console.error(err);
      }
      setAuthLoading(false);
    }
  }, []);
  return (
    <AuthContext.Provider value={{ authValues, updateAuth, clearAuth, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default Auth;
