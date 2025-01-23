import { createContext, ReactNode, useEffect, useState } from "react";

export const AuthContext = createContext<{
  authValues?: AuthType;
  updateAuth: (authData: AuthType) => void;
}| null>(null);
const authStorageName = "auth";

const Auth = ({ children }: { children?: ReactNode }) => {
  const [authValues, setAuthValues] = useState<AuthType>();
  const updateAuth = (authData: AuthType) => {
    localStorage.setItem(authStorageName, JSON.stringify(authData));
    setAuthValues(authData);
  };

  useEffect(() => {
    const authObString = localStorage.getItem(authStorageName);
    if (authObString) {
      const authOb = JSON.parse(authObString);
      if (authOb) {
        setAuthValues(authOb);
      }
    }
  }, []);
  return (
    <AuthContext.Provider value={{ authValues, updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default Auth;
