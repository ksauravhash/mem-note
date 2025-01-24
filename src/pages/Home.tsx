import { Box } from "@mui/material";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Outlet />
    </Box>
  );
};

export default Home;
