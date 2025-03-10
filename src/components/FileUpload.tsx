import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { formatFileSize } from "../utility/file";

type FileUploadType = {
  show: boolean,
  handleClose: () => void;
}

const FileUpload = ({ show, handleClose }: FileUploadType) => {
  const [file, setFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files && e.target.files.length > 0)
      setFile(e.target.files[0]);
  }

  const handleFileChoose = () => {
    fileInputRef.current?.click();
  }

  const handleRealClose = () => {
    handleClose();
    setFile(undefined);
  }


  return (
    <Dialog open={show} onClose={handleRealClose}>
      <DialogTitle>Import a notebook</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Click on the button below to select the file.
        </DialogContentText>
        <input ref={fileInputRef} type="file" onChange={handleChange} style={{ display: 'none' }} accept=".mynt"/>
        <Button sx={{ mt: 2 }} variant="contained" onClick={handleFileChoose}>Choose file</Button>
        {file && (<Box sx={{ mt: 2 }}>
          <Typography>Name: {file.name}</Typography>
          <Typography>Size: {formatFileSize(file.size)}</Typography>
        </Box>)}
        <Button sx={{ mt: 3 }} fullWidth>Import</Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRealClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default FileUpload