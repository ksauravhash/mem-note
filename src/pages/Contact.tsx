import { Typography, Button, TextField, Container, Paper } from "@mui/material";
import { Chat } from "@mui/icons-material";
import { useContext, useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";
import axiosInstance from "../utility/axiosInstance";
import { AlertContext } from "../components/AlertSystem";

type contactFormType = {
  name: string;
  email: string;
  message: string;
}

type contactFormErrorType = {
  name?: string,
  email?: string,
  message?: string
}

const initialFormData = { name: '', email: '', message: '' };

const Contact = () => {

  const [formData, setFormData] = useState<contactFormType>(initialFormData);
  const [formError, setFormError] = useState<contactFormErrorType>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const AlertSystem = useContext(AlertContext);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errotOb: contactFormErrorType = {};
    if (!formData.name)
      errotOb.name = "Name can't be empty."
    if (!formData.email)
      errotOb.email = "Email can't be empty."
    else if (!validateEmail(formData.email))
      errotOb.email = "Invalid email"

    if (!formData.message)
      errotOb.message = "Message can't be empty."
    setFormError(errotOb);

    try {
      await axiosInstance.post('/contact/sendMessage', formData);
      AlertSystem?.pushAlert('Your message has been sent.');
      setFormData(initialFormData);
      setFormError({});
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response?.status >= 500) {
          navigate('/serverError');
        }
      }
      else {
        console.log(err);
      }
    }
    setLoading(false);
  }

  const handleChange: (React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          <Chat color="primary" /> Contact Us
        </Typography>
        <form onSubmit={handleSubmit}>

          <TextField
            fullWidth
            label="Name"
            margin="normal"
            variant="outlined"
            required
            helperText={formError.name}
            value={formData.name}
            error={!!formError.name}
            name="name"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            variant="outlined"
            type='email'
            required
            helperText={formError.email}
            value={formData.email}
            error={!!formError.email}
            name="email"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Message"
            margin="normal"
            variant="outlined"
            multiline rows={4}
            required
            helperText={formError.message}
            value={formData.message}
            error={!!formError.message}
            name="message"
            onChange={handleChange}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth sx={{ mt: 2 }}
            type='submit'
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Send Message'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Contact;
