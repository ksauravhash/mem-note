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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../utility/axiosInstance";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate } from "react-router";
import FileUpload from "./FileUpload";

type NotebookData = {
  title: string;
  id: string;
};

const Dashboard = () => {
  const [recentNotebooks, setRecentNotebooks] = useState<NotebookData[]>();
  const [showDialog, setShowDialog] = useState(false);
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [addNotebookLoading, setAddNotebookLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down('md'))
  const updateRecentNotebooks = async () => {
    const notebooks = (await axiosInstance.get("/notebook/getRecentNotebooks"))
      .data as NotebookData[];
    setRecentNotebooks(notebooks);
  };

  const handleImportFabClick: React.MouseEventHandler<HTMLButtonElement> = ()=> {
    setShowFileDialog(true);
  }

  const handleImportClose = ()=> {
    setShowFileDialog(false);
  }

  const handleAddFabClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    setShowDialog(true);
  };

  const handleAddCancel: React.MouseEventHandler<HTMLButtonElement> = () => {
    setTitle("");
    setShowDialog(false);
  };

  const noteNavigationButtonClick = (noteID: string) => {
    navigate(`/note/${noteID}`);
  }

  const handleAddActionButton: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    setAddNotebookLoading(true);
    if (title) {
      try {
        const resp = await axiosInstance.post("/notebook/create", {
          title,
        });
        await axiosInstance.post('/notebook/getNotebook', {
          id: resp.data.id
        });
        setTitleError("");
        setTitle("");
        setShowDialog(false);
        navigate(`note/${resp.data.id}`);
      } catch (err) {
        console.error(err);
      }
    } else {
      setTitleError("Name cannot be empty");
    }
    setAddNotebookLoading(false);
  };

  useEffect(() => {
    updateRecentNotebooks();
  }, []);
  return (
    <Box margin={4}>
      <Container sx={{ marginBottom: '1.5rem' }}>
        <Typography variant="h1" sx={{ fontWeight: "bold" }}>Notebooks</Typography>
      </Container>
      <Container>
        <Typography variant="h2" marginBottom={2}>
          Recent
        </Typography>
        <Stack direction={"row"} spacing={2}>
          {recentNotebooks &&
            recentNotebooks.map((item) => (
              <Link key={item.id} component={Button} onClick={() => { noteNavigationButtonClick(item.id) }}>
                {item.title}
              </Link>
            ))}
          {
            recentNotebooks?.length == 0 &&
            <Box>
              <Typography>

                There are no notebooks. Click on the &nbsp;
                <Typography component="span" color="warning">
                  ADD A NOTEBOOK &nbsp;
                </Typography>
                button to create a new one.
              </Typography>
            </Box>
          }
        </Stack>
      </Container>
      <Box sx={{
        position: "fixed",
        right: '1rem',
        bottom: '1rem'
      }}>
        <Fab
          variant={!md ? 'extended' : 'circular'} size="large"
          aria-label="Import a notebook"
          sx={{
            mr: 2
          }}
          onClick={handleImportFabClick}
        >
          <UploadFileIcon />
          {!md && "Import a notebook"}
        </Fab>
        <Fab
          variant={!md ? 'extended' : 'circular'} size="large"
          aria-label="Add a notebook"
          onClick={handleAddFabClick}
        >
          <AddIcon />
          {!md && "Add a notebook"}
        </Fab>
      </Box>
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
          <Button variant="contained" onClick={handleAddActionButton} type="submit" disabled={addNotebookLoading}>
            {addNotebookLoading ? 'Loading...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <FileUpload show={showFileDialog} handleClose={handleImportClose}/>
    </Box>
  );
};

export default Dashboard;
