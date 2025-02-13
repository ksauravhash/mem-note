import { Typography, Button, Stack, Container } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const SessionExpired = () => {
  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 3,
        textAlign: "center",
      }}
    >
      {/* Error Icon */}
      <ErrorOutlineIcon
        color="error"
        sx={{
          fontSize: "8rem",
          mb: 2,
        }}
      />

      {/* Error Message */}
      <Typography variant="h4" sx={{ mb: 1 }}>
        Session Expired
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }} color="secondary">
        Your session has expired due to inactivity or security reasons. Please log in again to continue.
      </Typography>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          color="primary"
          href="/login" 
          sx={{ px: 4 }}
        >
          Go to Login
        </Button>
      </Stack>
    </Container>
  )
}

export default SessionExpired