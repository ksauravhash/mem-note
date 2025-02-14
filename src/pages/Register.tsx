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
import { AlertContext } from "../components/AlertSystem";

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

  const navigate = useNavigate();

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
        const { confirmPassword, ...payload } = registrationDetail;
        await axiosInstance.post("user/register", payload);
        navigate("/login");
        alertOb?.pushAlert('You have successfully registered your account.', 'success');
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.status == 400) {
            navigate("/");
          } else if (err.status && err.status >= 500 && err.status < 600) {
            navigate("/serverError");
          }
        }
      }
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
                required
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
                required
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
                required
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
            >
              Register
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
