import { Typography, Button, TextField, Container, Paper, Box, CircularProgress, Fade, Zoom, Grid2 as Grid } from "@mui/material";
import { Send, Person, Email, Message } from "@mui/icons-material";
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
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();
  const AlertSystem = useContext(AlertContext);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errorObj: contactFormErrorType = {};
    
    if (!formData.name)
      errorObj.name = "Name can't be empty."
    if (!formData.email)
      errorObj.email = "Email can't be empty."
    else if (!validateEmail(formData.email))
      errorObj.email = "Invalid email"
    if (!formData.message)
      errorObj.message = "Message can't be empty."
    
    setFormError(errorObj);
    
    // Check if there are any errors
    if (Object.keys(errorObj).length > 0) {
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post('/contact/sendMessage', formData);
      AlertSystem?.pushAlert('Your message has been sent successfully!');
      setFormData(initialFormData);
      setFormError({});
      setSubmitted(true);
      
      // Reset submitted state after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response?.status >= 500) {
          navigate('/serverError');
        } else {
          AlertSystem?.pushAlert('Failed to send message. Please try again.', 'error');
        }
      }
      else {
        console.log(err);
        AlertSystem?.pushAlert('An unexpected error occurred.', 'error');
      }
    }
    setLoading(false);
  }

  const handleChange: (React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Zoom in={true} timeout={800}>
        <Paper 
          elevation={6} 
          sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: 3,
            background: 'rgba(24, 26, 27, 0.85)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 174, 239, 0.2)',
            overflow: 'hidden'
          }}
        >
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                p: 2
              }}>
                <Fade in={true} timeout={1200}>
                  <Box>
                    <Typography 
                      variant="h3" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #00AEEF 30%, #A933FF 90%)',
                        backgroundClip: 'text',
                        textFillColor: 'transparent',
                        mb: 3
                      }}
                    >
                      Get in Touch
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                      Have questions or feedback? We'd love to hear from you! Fill out the form and our team will get back to you as soon as possible.
                    </Typography>
                    
                  </Box>
                </Fade>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 7 }}>
              <Fade in={true} timeout={1000}>
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                    Send us a message
                  </Typography>
                  
                  <form onSubmit={handleSubmit}>
                    <Box sx={{ position: 'relative' }}>
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
                        slotProps={{
                          input: {
                            startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                          }
                        }}
                        sx={{ mb: 2 }}
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
                        slotProps={{
                          input: {
                            startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                          }
                        }}
                        sx={{ mb: 2 }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Message"
                        margin="normal"
                        variant="outlined"
                        multiline 
                        rows={5}
                        required
                        helperText={formError.message}
                        value={formData.message}
                        error={!!formError.message}
                        name="message"
                        onChange={handleChange}
                        slotProps={{
                          input: {
                            startAdornment: <Message sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start' }} />
                          }
                        }}
                        sx={{ mb: 3 }}
                      />
                      
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth 
                        type='submit'
                        disabled={loading || submitted}
                        size="large"
                        sx={{ 
                          py: 1.5,
                          position: 'relative',
                          overflow: 'hidden',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            top: 0,
                            left: 0,
                            background: 'linear-gradient(45deg, rgba(0,174,239,0) 0%, rgba(0,174,239,0.3) 50%, rgba(0,174,239,0) 100%)',
                            transform: submitted ? 'translateX(100%)' : 'translateX(-100%)',
                            transition: 'transform 0.6s ease-in-out',
                            ...(submitted && {
                              animation: 'shine 1.5s infinite'
                            })
                          },
                          '@keyframes shine': {
                            '0%': {
                              transform: 'translateX(-100%)'
                            },
                            '100%': {
                              transform: 'translateX(100%)'
                            }
                          }
                        }}
                        endIcon={loading ? undefined : <Send />}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : submitted ? (
                          'Message Sent!'
                        ) : (
                          'Send Message'
                        )}
                      </Button>
                    </Box>
                  </form>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Paper>
      </Zoom>
    </Container>
  );
};

export default Contact;
