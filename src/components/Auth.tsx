import { createContext, ReactNode,  useState } from "react";

export const AuthContext = createContext(null);

const Auth = ({children}: {children?: ReactNode}) => {
  const [authValues, setAuthValues] = useState(null);
  return <AuthContext.Provider value={authValues}>
    {children}
  </AuthContext.Provider>;
};

export default Auth;
