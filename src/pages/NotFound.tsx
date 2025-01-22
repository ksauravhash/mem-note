import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router";

const StyledBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginTop: theme.spacing(10),
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Redirect to the homepage
  };

  return (
    <Container maxWidth="sm">
      <StyledBox>
        <Typography variant="h1" color="primary" gutterBottom>
          404
        </Typography>
        <StyledTypography variant="h5">
          Oops! The page you're looking for doesn't exist.
        </StyledTypography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          You may have mistyped the address, or the page has moved.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGoHome}
          sx={{ marginTop: 3 }}
        >
          Go Back Home
        </Button>
      </StyledBox>
    </Container>
  );
};

export default NotFound;
