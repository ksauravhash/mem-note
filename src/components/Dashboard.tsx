import { Box, Button, Container, Link, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import axiosInstance from "../utility/axiosInstance";
import { AuthContext } from "./Auth";

type NotebookData = {
  title: string;
  id: string;
};

const Dashboard = () => {
  const [recentNotebooks, setRecentNotebooks] = useState<NotebookData[]>();
  const authVauesOb = useContext(AuthContext);
  const updateRecentNotebooks = async () => {
    const notebooks = (await axiosInstance.get("/notebook/getRecentNotebooks", {
      headers: {
        Authorization: `bearer ${authVauesOb?.authValues?.accessToken}`,
      },
    })).data as NotebookData[];

    setRecentNotebooks(notebooks);
  };
  useEffect(() => {
    updateRecentNotebooks();
  }, []);
  return (
    <Box margin={4}>
      <Container sx={{ marginBottom: 4 }}>
        <Typography variant="h1">Notebooks</Typography>
      </Container>
      <Container>
        <Typography variant="h2" marginBottom={2}>
          Recent
        </Typography>
        <Stack direction={"row"} spacing={2}>
          {recentNotebooks && recentNotebooks.map((item) => (
            <Link component={Button}>{item.title}</Link>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default Dashboard;
