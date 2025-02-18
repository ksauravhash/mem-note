import { Typography, Button, TextField, Container, Paper } from "@mui/material";
import { Chat } from "@mui/icons-material";

const Contact = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          <Chat color="primary" /> Contact Us
        </Typography>
        <TextField fullWidth label="Name" margin="normal" variant="outlined" />
        <TextField fullWidth label="Email" margin="normal" variant="outlined" />
        <TextField fullWidth label="Message" margin="normal" variant="outlined" multiline rows={4} />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Send Message
        </Button>
      </Paper>
    </Container>
  );
};

export default Contact;
