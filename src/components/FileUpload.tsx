import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, Typography } from "@mui/material";
import { useContext, useRef, useState } from "react";
import { formatFileSize } from "../utility/file";
import axiosInstance from "../utility/axiosInstance";
import { AlertContext } from "./AlertSystem";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";

type FileUploadType = {
  show: boolean,
  handleClose: () => void;
}

type CurrentUploadStateType = {
  state: 'start' | 'ready' | 'uploading' | 'error' | 'done';
  progress: number;
  error: string;
}

const initialCurrentUploadState: CurrentUploadStateType = {
  state: 'start',
  progress: 0,
  error: ''
}


const FileUpload = ({ show, handleClose }: FileUploadType) => {
  const [file, setFile] = useState<File>();
  const [currentUploadState, setCurrentUploadState] = useState<CurrentUploadStateType>(initialCurrentUploadState);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const AlertSystem = useContext(AlertContext);

  const navigate = useNavigate();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setCurrentUploadState(prev => {
        return { ...prev, state: 'ready' }
      })
    }
  }

  const handleFileChoose = () => {
    fileInputRef.current?.click();
  }

  const handleRealClose = () => {
    handleClose();
    setCurrentUploadState(initialCurrentUploadState);
    setFile(undefined);
  }

  const handleImport = async () => {
    try {
      const resp = await axiosInstance.post('/notebook/uploadNotebookFile', {
        notebook: file
      }, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            if (progressEvent.total) {
              const bytes = progressEvent.loaded;
              const total = progressEvent.total || 0;
              let progress = 0;
              if (total !== 0)
                progress = (bytes / total) * 100;
              if (progress >= 100) {
                setCurrentUploadState(prev => ({ ...prev, state: 'done' }))
              } else {

                setCurrentUploadState(prev => {
                  return { ...prev, progress, state: 'uploading' }
                })
              }
            }
          }
        }
      });
      const { id } = resp.data as { id: string };
      navigate(`note/${id}`);
      setCurrentUploadState(prev => {
        return { ...prev, state: 'done' }
      })
      handleRealClose();
      AlertSystem?.pushAlert('Notebook successfully imported');
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          const errData = err.response.data as { error: string };
          setCurrentUploadState({
            error: errData.error,
            progress: 0,
            state: 'error'
          })
        }
      }
    }
  }


  return (
    <Dialog open={show} onClose={handleRealClose}>
      <DialogTitle>Import a notebook</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Click on the button below to select the file.
        </DialogContentText>
        <input ref={fileInputRef} type="file" onChange={handleChange} style={{ display: 'none' }} accept=".mynt" required />
        <Button sx={{ mt: 2 }} variant="contained" onClick={handleFileChoose}>Choose file</Button>
        {file && (<Box sx={{ mt: 2 }}>
          <Typography>Name: {file.name}</Typography>
          <Typography>Size: {formatFileSize(file.size)}</Typography>
        </Box>)}
        {currentUploadState.state === 'uploading' &&
          <LinearProgress sx={{ mt: 2 }} variant="determinate" value={currentUploadState.progress} />
        }
        {currentUploadState.state === 'error' &&
          <Typography color="error">{currentUploadState.error}</Typography> 
        }
        <Button
          sx={{ mt: 3 }}
          fullWidth
          disabled={currentUploadState.state === 'start' || currentUploadState.state === 'uploading'}
          onClick={handleImport}>{currentUploadState.state === 'uploading' ? 'Uploading...' : 'Import'}</Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleRealClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default FileUpload