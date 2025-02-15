import { Box } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { useContext, useEffect } from "react";
import { AuthContext } from "../components/Auth";
import Landing from "../components/Landing";
import Dashboard from "../components/Dashboard";

const Home = () => {
  const authValuesOb = useContext(AuthContext);
  const locationObject = useLocation();
  const navigation = useNavigate();
  useEffect(()=> {
    if (authValuesOb?.tokenExpired) {
       navigation('/sessionExpired');
    }
  },[authValuesOb?.tokenExpired])
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
