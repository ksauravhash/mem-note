import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";

const Landing = () => {
  const navigation = useNavigate();
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (_) => {
    navigation("/login");
  };
  return (
    <Container sx={{ textAlign: "center", margin: "auto" }}>
      <Box>
        <Typography variant="h1" color="textPrimary">
          <span>Learn</span>
          <br />
          Faster with MemNote
        </Typography>

        <Button variant="outlined" size="large" fullWidth onClick={handleClick}>
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Landing;
