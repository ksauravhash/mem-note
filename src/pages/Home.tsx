import { Box } from "@mui/material";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { useContext } from "react";
import { AuthContext } from "../components/Auth";
import { Dashboard } from "@mui/icons-material";
import Landing from "../components/Landing";

const Home = () => {
  const authValuesOb = useContext(AuthContext);
  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Outlet />
      {authValuesOb?.authValues ? <Dashboard /> : <Landing />}
    </Box>
  );
};

export default Home;
