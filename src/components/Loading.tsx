import { CircularProgress, Container, Typography } from "@mui/material";

const Loading = ({ message = "Loading..." }) => {
  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 3,
      }}
    >
      <CircularProgress color="primary" />
      <Typography variant="h6">
        {message}
      </Typography>
    </Container >
  );
};

export default Loading;
