import { Typography, Button, Stack, Container } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ServerErrorPage = () => {
  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        color: "text.primary",
        px: 3,
        textAlign: "center",
      }}
    >
      {/* Error Icon */}
      <ErrorOutlineIcon
        sx={{
          fontSize: "8rem",
          color: "error.main",
          mb: 2,
        }}
      />

      {/* Error Message */}
      <Typography variant="h4" sx={{ mb: 1 }}>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
        We're experiencing some technical difficulties. Please try again later.
      </Typography>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          color="primary"
          href="/" // Redirects to the homepage
          sx={{ px: 4 }}
        >
          Go to Homepage
        </Button>
      </Stack>
    </Container>
  );
};

export default ServerErrorPage;
