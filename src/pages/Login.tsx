import { useContext, useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Grid2 as Grid,
  Link,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router";
import StyledPaper from "./StyledPaper";
import axiosInstance, { checkServerHealth } from "../utility/axiosInstance";
import axios from "axios";
import { AuthContext } from "../components/Auth";
import { AlertContext } from "../components/AlertSystem";
import Loading from "../components/Loading";
import { jwtDecode } from "jwt-decode";
import { Google as GoogleIcon } from "@mui/icons-material";

const LoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [remember, setRemember] = useState(false);
  const [serverError, setServerError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [serverStarting, setServerStarting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [serverStatus, setServerStatus] = useState<'idle' | 'starting' | 'ready'>('idle');

  const navigate = useNavigate();

  const [searchParam, _] = useSearchParams();

  const authValuesOb = useContext(AuthContext);

  const accessToken = searchParam.get('at');
  const refreshToken = searchParam.get('rt');

  const alertOb = useContext(AlertContext);

  // Check if server is ready
  useEffect(() => {
    if (serverStarting) {
      const checkServerStatus = async () => {
        try {
          const isHealthy = await checkServerHealth();
          if (isHealthy) {
            setServerStarting(false);
            setServerStatus('ready');
            alertOb?.pushAlert('Server is now ready. You can login.', 'success');
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

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleLogin: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    let isValid = true;
    setServerError("");
    setLoading(true);

    // Username validation
    if (!username) {
      setUsernameError("Username is required");
      isValid = false;
    } else if (!validateUsername(username)) {
      setUsernameError("Please enter a valid username");
      isValid = false;
    } else {
      setUsernameError("");
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    } else {
      setPasswordError("");
    }

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
        
        const payload = { username, password };
        const loginResponse = await axiosInstance.post("user/login", payload);
        const loginData = {...loginResponse.data, remember};
        authValuesOb?.updateAuth(loginData);
        navigate('/');
        alertOb?.pushAlert('You have successfully logged in.', 'success');
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status == 401) {
            console.log(err.response);
            setServerError(err.response?.data.error);
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

  const handleGoogleLogin = async () => {
    try {
      // Check if server is ready before redirecting
      const isServerReady = await checkServerHealth();
      
      if (!isServerReady) {
        setServerStarting(true);
        setServerStatus('starting');
        alertOb?.pushAlert('The server appears to be starting up. Please wait a moment.', 'info');
        return;
      }
      
      window.location.replace(`${import.meta.env.VITE_API_BASE_URL}/user/login/google`);
    } catch (err) {
      alertOb?.pushAlert('Unable to connect to the server. Please try again later.', 'error');
    }
  }

  useEffect(() => {
    if (accessToken && refreshToken) {
        const decodedUser = jwtDecode(accessToken) as { id: string; username: string; name: string; email: string };
        authValuesOb?.updateAuth({ accessToken, refreshToken, user: { ...decodedUser, verified: true }, remember });
    }
  }, [accessToken, refreshToken]);

  useEffect(() => {
    if (authValuesOb?.authValues && location.pathname !== '/')
      navigate('/');
  }, [authValuesOb?.authValues]);

  if (authValuesOb?.authLoading)
    return <Loading />;

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
            Login
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
            {/* Username Input */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Username"
                type="username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!!usernameError}
                helperText={usernameError}
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
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                required
                disabled={serverStatus === 'starting'}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControlLabel 
                label="Remember me" 
                control={
                  <Checkbox 
                    checked={remember} 
                    onChange={() => { setRemember(prev => !prev) }} 
                    disabled={serverStatus === 'starting'}
                  />
                } 
              />
            </Grid>
          </Grid>

          {/* Server Error Message */}
          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="error">
              {serverError}
            </Typography>
          </Box>

          {/* Login Button */}
          <Box mt={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleLogin}
              type="submit"
              disabled={loading || serverStatus === 'starting'}
            >
              {loading ? "Loading..." : serverStatus === 'starting' ? "Waiting for server..." : "Login"}
            </Button>
          </Box>
          <Box mt={3}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleGoogleLogin}
              startIcon={<GoogleIcon />}
              disabled={serverStatus === 'starting'}
            >
              Google Login
            </Button>
          </Box>

          {/* Sign Up Link */}
          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link component={RouterLink} to={"/register"}>
                Register
              </Link>
            </Typography>
          </Box>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default LoginPage;
