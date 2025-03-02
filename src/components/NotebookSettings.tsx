import { Box, Button, Container, Dialog, Paper, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useContext, useState } from "react";
import axiosInstance from "../utility/axiosInstance";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { AlertContext } from "./AlertSystem";

type NotebookSetingsType = {
  showModal: boolean,
  handleClose: () => void,
  notebookID: string,
  title: string
}

const NotebookSettings = ({
  showModal,
  handleClose,
  notebookID,
  title
}: NotebookSetingsType) => {
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down('md'));

  const navigation = useNavigate();

  const AlertSystem = useContext(AlertContext);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

  const handleDialogClose = () => {
    handleClose();
  }

  const handleDeleteButton = () => {
    setDeleteConfirm(true);
  }

  const handleRealDeleteButton = async () => {
    if (confirmInput !== title)
      return;

    try {
      await axiosInstance.delete(`/notebook/deleteNotebook/${notebookID}`)
      navigation('/');
      AlertSystem?.pushAlert('Notebook deleted successfully!', 'success');
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response?.status >= 500) {
          navigation('/serverError');
        }
      }
      else {
        console.log(err);
      }
    }
    setConfirmInput('');
    setDeleteConfirm(false);
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setConfirmInput(event.target.value);
  }


  return (
    <Dialog open={showModal} fullScreen={md} onClose={handleDialogClose}>
      <Container sx={{ p: 4 }}>
        <Paper
          sx={{ p: 4 }}
        >
          <Typography variant="h4">Settings</Typography>
          <Box mt={4}>
            <TextField value={title} variant="outlined" disabled fullWidth sx={{ mb: 2 }} />
            <Button variant="text" color="secondary" onClick={handleDeleteButton}>Delete Notebook</Button>
          </Box>
          <Box mt={4} display={deleteConfirm ? 'block' : 'none'} p={4}>
            <Typography variant="body2" mb={2}> To confirm, type the name of the notebook in the box below </Typography>
            <TextField
              variant="standard"
              placeholder="Notebook name"
              name="confirmInput"
              onChange={handleChange}
              value={confirmInput}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button color="error" disabled={confirmInput !== title} fullWidth onClick={handleRealDeleteButton}>Delete</Button>
          </Box>
        </Paper>
      </Container>
    </Dialog>
  )
}

export default NotebookSettings;