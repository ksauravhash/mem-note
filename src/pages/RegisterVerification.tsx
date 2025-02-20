import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { Button, Card, CardContent, Container, Typography, } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router"
import axiosInstance from "../utility/axiosInstance";

const RegisterVerification = () => {
  const location = useLocation();
  const data = location.state;
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  if (data.regDetails) {

    useEffect(() => {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setCanResend(true);
      }
    }, [countdown]);

    const handleResend = () => {
      setCanResend(false);
      setCountdown(30);
      axiosInstance.post("user/generateUserVerificationEmail", { username: data.regDetails?.username, email: data.regDetails?.email });
    };


    return (
      <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Card sx={{ p: 4, textAlign: "center", maxWidth: 400, }}>
          <CardContent>
            <CheckCircleIcon color="success" fontSize="large" />
            <Typography variant="h5" sx={{ mt: 2 }}>
              Verify Your Email
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              We've sent a verification email to <strong>{data.regDetails?.email}</strong>. Please check your inbox and click the link to verify your account.
            </Typography>
            <Typography variant="body2" color="secondary" sx={{ mt: 1 }}>
              This link is valid for 30 minutes.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              disabled={!canResend}
              sx={{ mt: 2 }}
              onClick={handleResend}
            >
              {canResend ? "Resend Email" : `Resend available in ${countdown}s`}
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  } else
    return (
      <Navigate to="/" />
    )
}

export default RegisterVerification