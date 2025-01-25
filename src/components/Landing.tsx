import {
  Box,
  Button,
  Container,
  Grid2 as Grid,
  Typography,
} from "@mui/material";

const Landing = () => {
  return (
    <Container sx={{ textAlign: "center", margin: "auto" }}>
      <Box>
        <Typography variant="h1" color="textPrimary">
          <span>Learn</span>
          <br />
          Faster
          with MemNote
        </Typography>

        <Button variant="outlined" size="large" fullWidth>
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Landing;
