import { Box } from "@mui/material";
import { matchPath, Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { useContext, useEffect } from "react";
import { AuthContext } from "../components/Auth";
import Landing from "../components/Landing";
import Dashboard from "../components/Dashboard";

const Home = () => {
  const authValuesOb = useContext(AuthContext);
  const locationObject = useLocation();
  const navigate = useNavigate();

  const isVerifyPath = matchPath('/verify/*', locationObject.pathname);
  useEffect(() => {
    if (!authValuesOb || !authValuesOb.authValues) return;
    if (authValuesOb) {
      if (authValuesOb.tokenExpired) {
        navigate('/sessionExpired');
      }
      else if (!isVerifyPath && authValuesOb.authValues && !authValuesOb.authValues.user.verified) {
        navigate("/registerVerification", {
          state: {
            regDetails: {
              username: authValuesOb.authValues.user.username,
              email: authValuesOb.authValues.user.email
            }
          }
        });
      }
    }
  }, [authValuesOb])
  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Outlet />
      {locationObject.pathname == "/" &&
        (authValuesOb?.authValues ? <Dashboard /> : <Landing />)}
    </Box>
  );
};

export default Home;
