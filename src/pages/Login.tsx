import { useContext, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Grid2 as Grid,
  Link,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router";
import StyledPaper from "./StyledPaper";
import axiosInstance from "../utility/axiosInstance";
import axios from "axios";
import { AuthContext } from "../components/Auth";

const LoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [serverError, setServerError] = useState<string>("");

  const navigate = useNavigate();

  const authValuesOb = useContext(AuthContext);

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
        const payload = { username, password };
        const loginResponse = await axiosInstance.post("user/login", payload);
        const loginData = loginResponse.data;
        authValuesOb?.updateAuth(loginData);
        navigate('/');
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status == 401) {
            console.log(err.response);
            setServerError(err.response?.data.error);
          } else if (err.status && err.status >= 500 && err.status < 600) {
            navigate("/serverError");
          }
        }
      }
    }
  };

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
            >
              Login
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
