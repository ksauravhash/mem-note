import { Box, Button, Container, Link, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../utility/axiosInstance";

type NotebookData = {
  title: string;
  id: string;
};

const Dashboard = () => {
  const [recentNotebooks, setRecentNotebooks] = useState<NotebookData[]>();
  const updateRecentNotebooks = async () => {
    const notebooks = (await axiosInstance.get("/notebook/getRecentNotebooks")).data as NotebookData[];
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
