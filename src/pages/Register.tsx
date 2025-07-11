import { useContext, useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Grid2 as Grid,
  Link,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router";
import StyledPaper from "./StyledPaper";
import axiosInstance, { checkServerHealth } from "../utility/axiosInstance";
import axios from "axios";
import { AlertContext } from "../components/AlertSystem";
import { AuthContext } from "../components/Auth";
import Loading from "../components/Loading";

const RegisterPage = () => {
  const [registrationDetail, setRegistrationDetails] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [error, setError] = useState({
    usernameError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
    nameError: "",
  });

  const [loading, setLoading] = useState(false);
  const [serverStarting, setServerStarting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [serverStatus, setServerStatus] = useState<'idle' | 'starting' | 'ready'>('idle');

  const navigate = useNavigate();
  const authValuesOb = useContext(AuthContext);

  const alertOb = useContext(AlertContext);

  const { username, email, password, confirmPassword, name } =
    registrationDetail;
  const {
    usernameError,
    emailError,
    passwordError,
    confirmPasswordError,
    nameError,
  } = error;

  // Check if server is ready
  useEffect(() => {
    if (serverStarting) {
      const checkServerStatus = async () => {
        try {
          const isHealthy = await checkServerHealth();
          if (isHealthy) {
            setServerStarting(false);
            setServerStatus('ready');
            alertOb?.pushAlert('Server is now ready. You can register.', 'success');
          } else {
            throw new Error('Server not ready');
          }
        } catch (err) {
          if (retryCount < 20) { // Limit to ~5 minutes of retries (15s * 20)
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 15000); // Check every 15 seconds
          } else {
            setServerStarting(false);
            setServerStatus('idle');
            alertOb?.pushAlert('Server seems to be taking too long to start. Please try again later.', 'error');
          }
        }
      };
      
      checkServerStatus();
    }
  }, [serverStarting, retryCount, alertOb]);

  const validateUsername = (username: string): boolean => {
    return !!username;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateConfirmPassword = (confirmPassword: string): boolean => {
    return password == confirmPassword;
  };

  const handleRegister: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    e.preventDefault();
    let isValid = true;
    const errorOb = {
      usernameError: "",
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
      nameError: "",
    };
    setError(errorOb);
    setLoading(true);
    // Username validation
    if (!username) {
      errorOb.usernameError = "Username is required";
      isValid = false;
    } else if (!validateUsername(username)) {
      errorOb.usernameError = "Please enter a different username";
      isValid = false;
    } else {
      errorOb.usernameError = "";
    }

    // Email validation
    if (!email) {
      errorOb.emailError = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      errorOb.emailError = "Please enter a valid email address";
      isValid = false;
    } else {
      errorOb.emailError = "";
    }

    // Password validation
    if (!password) {
      errorOb.passwordError = "Password is required";
      isValid = false;
    } else if (!validatePassword(password)) {
      errorOb.passwordError = "Password must be at least 8 characters long";
      isValid = false;
    } else {
      errorOb.passwordError = "";
    }

    // Confirm Password validation
    if (!confirmPassword) {
      errorOb.confirmPasswordError = "Password is required";
      isValid = false;
    } else if (!validateConfirmPassword(confirmPassword)) {
      errorOb.confirmPasswordError = "This must match the password.";
      isValid = false;
    } else {
      errorOb.confirmPasswordError = "";
    }

    if (!name) {
      errorOb.nameError = "Name is required";
      isValid = false;
    } else {
      errorOb.nameError = "";
    }

    setError(errorOb);
    if (isValid) {
      try {
        // First check if the server is available
        const isServerReady = await checkServerHealth();
        
        if (!isServerReady) {
          setServerStarting(true);
          setServerStatus('starting');
          alertOb?.pushAlert('The server appears to be starting up. Please wait a moment.', 'info');
          setLoading(false);
          return;
        }
        
        const { confirmPassword, ...payload } = registrationDetail;
        await axiosInstance.post("user/register", payload);
        await axiosInstance.post("user/generateUserVerificationEmail", { username, email });
        navigate("/registerVerification", {
          state: {
            regDetails: {
              username,
              email
            }
          }
        });
        alertOb?.pushAlert('You have successfully registered your account.', 'success');
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.status == 400) {
            navigate("/");
          } else if (err.status == 409) {
            const errData = err.response?.data as { type: string; message: string };
            setError(prev => ({ ...prev, [`${errData.type}Error`]: errData.message }));
          } else if (err.status && err.status >= 500 && err.status < 600) {
            navigate("/serverError");
          } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout') || 
                    (err.response?.status === 503) || !err.response) {
            // Server might be starting up (common with Render free tier)
            setServerStarting(true);
            setServerStatus('starting');
            alertOb?.pushAlert('The server appears to be starting up. Please wait a moment.', 'info');
          }
        }
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRegistrationDetails((oldValues) => ({
      ...oldValues,
      [event.target.name]: event.target.value,
    }));
  };

  if (authValuesOb?.authLoading)
    return <Loading />

  if (authValuesOb?.authValues)
    navigate('/');

  return (
    <Container
      maxWidth="sm"
      sx={{
        margin: 0,
        marginLeft: "auto",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <StyledPaper sx={{ margin: "auto" }}>
        <Box mb={3}>
          <Typography variant="h4" align="center" gutterBottom>
            Register
          </Typography>
        </Box>
        
        {serverStatus === 'starting' && (
          <Alert 
            severity="info" 
            sx={{ mb: 2 }}
            icon={<CircularProgress size={20} />}
          >
            Server is starting up. This may take up to 2 minutes with the deployed backend server.
            {retryCount > 0 && ` Retry attempt: ${retryCount}/20`}
          </Alert>
        )}
        
        <form>
          <Grid container spacing={2}>
            {/* Name Input */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Name"
                type="name"
                name="name"
                variant="outlined"
                value={name}
                onChange={handleChange}
                error={!!nameError}
                helperText={nameError}
                required
                disabled={serverStatus === 'starting'}
              />
            </Grid>
            {/* Username Input */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Username"
                type="username"
                name="username"
                variant="outlined"
                value={username}
                onChange={handleChange}
                error={!!usernameError}
                helperText={usernameError}
                autoComplete="username"
                required
                disabled={serverStatus === 'starting'}
              />
            </Grid>
            {/* Email Input */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                variant="outlined"
                value={email}
                onChange={handleChange}
                error={!!emailError}
                helperText={emailError}
                autoComplete="email"
                required
                disabled={serverStatus === 'starting'}
              />
            </Grid>

            {/* Password Input */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                variant="outlined"
                value={password}
                onChange={handleChange}
                error={!!passwordError}
                helperText={passwordError}
                autoComplete="new-password"
                required
                disabled={serverStatus === 'starting'}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                variant="outlined"
                value={confirmPassword}
                onChange={handleChange}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                required
                disabled={serverStatus === 'starting'}
              />
            </Grid>
          </Grid>

          {/* Register Button */}
          <Box mt={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleRegister}
              type="submit"
              disabled={loading || serverStatus === 'starting'}
            >
              {loading ? "Loading..." : serverStatus === 'starting' ? "Waiting for server..." : "Register"}
            </Button>
          </Box>

          {/* Sign Up Link */}
          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Already have an account?{" "}
              <Link component={RouterLink} to={"/login"}>
                Login
              </Link>
            </Typography>
          </Box>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default RegisterPage;
