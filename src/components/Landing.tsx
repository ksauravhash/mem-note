import {
  Box,
  Button,
  Container,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router";

const Landing = () => {
  const navigation = useNavigate();
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (_) => {
    navigation("/login");
  };
  const theme = useTheme();
  return (
    <Container sx={{ textAlign: "center", margin: "auto" }}>
      <Box>
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 3 }}>
          Learn <span style={{ color: theme.palette.primary.main }}>Faster</span> with <span style={{ color: theme.palette.primary.main }}>MemNote</span>
      </Typography>
      <Typography variant="h5" sx={{ mt: 1, mb: 4 }}>
        The smarter way to memorize and retain information.
      </Typography>
      <Button variant="outlined" size="large" sx={{ width: '50%', maxWidth: '250px' }} onClick={handleClick}>
        Login
      </Button>
    </Box>
    </Container >
  );
};

export default Landing;
