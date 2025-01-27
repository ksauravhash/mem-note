import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../utility/axiosInstance";
import AddIcon from "@mui/icons-material/Add";

type NotebookData = {
  title: string;
  id: string;
};

const Dashboard = () => {
  const [recentNotebooks, setRecentNotebooks] = useState<NotebookData[]>();
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const updateRecentNotebooks = async () => {
    const notebooks = (await axiosInstance.get("/notebook/getRecentNotebooks"))
      .data as NotebookData[];
    setRecentNotebooks(notebooks);
  };

  const handleFabClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    setShowDialog(true);
  };

  const handleAddCancel: React.MouseEventHandler<HTMLButtonElement> = () => {
    setTitle("");
    setShowDialog(false);
  };

  const handleAddActionButton: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    if (title) {
      try {
        const resp = await axiosInstance.post("/notebook/create", {
          title,
        });
        const resp2 = await axiosInstance.post('/notebook/getNotebook', {
          id: resp.data.id
        });
        console.log(resp2.data);        
        setTitleError("");
        setTitle("");
        setShowDialog(false);
      } catch (err) {
        console.error(err);
      }
    }else {
      setTitleError("Name cannot be empty");
    }
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
          {recentNotebooks &&
            recentNotebooks.map((item) => (
              <Link key={item.id} component={Button}>
                {item.title}
              </Link>
            ))}
        </Stack>
      </Container>
      <Fab
        variant="extended"
        aria-label="Add a notebook"
        sx={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
        }}
        onClick={handleFabClick}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add a notebook
      </Fab>
      <Dialog open={showDialog}>
        <DialogTitle>New notebook</DialogTitle>
        <DialogContent>
          <DialogContentText>
            What should be the name of your new notebook?
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="title"
            name="title"
            label="Name"
            fullWidth
            variant="standard"
            value={title}
            onChange={(el) => {
              setTitle(el.target.value);
            }}
            helperText={titleError}
            error={!!titleError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleAddActionButton} type="submit">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
