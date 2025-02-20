import { CheckCircle as CheckCircleIcon, ErrorOutline as ErrorOutlineIcon } from "@mui/icons-material";
import { Button, Card, CardContent, Container, Link, Typography, } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../utility/axiosInstance";
import { useParams, Link as RouterLink, useNavigate } from "react-router"
import { AxiosError } from "axios";
import Loading from "../components/Loading";

type paramType = {
  uniqueToken: string
}

const VerifyAccount = () => {
  const params = useParams<paramType>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const verifyAccount = async () => {
    try {
      await axiosInstance.post('/user/verifyAccount', { uniqueToken: params.uniqueToken });
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.status == 401) {
          setError('The verification link is either invalid or has expired. Please request a new verification email to continue.')
        } else if (err.status && err.status >= 500 && err.status < 600) {
          navigate("/serverError");
        }
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    verifyAccount();
  }, [])
  if (loading)
    return <Loading />;

  return (
    <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card sx={{ p: 4, textAlign: "center", maxWidth: 400, }}>
        <CardContent>
          {error ? (<ErrorOutlineIcon color="error" fontSize="x-large" />) :
            <CheckCircleIcon color="success" fontSize="large" />}
          <Typography variant="h4" sx={{ mt: 2 }} color={error ? 'error' : 'success'}>
            {error ? 'Invalid or Expired Link' : `Account Verified!`}

          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }} color={error ? 'secondary' : 'textPrimary'}>
            {error ? error : `🎉 Your email has been successfully verified. You can now log in and start using MemNote!`}
          </Typography>
          {!error &&
            <Link component={RouterLink} to={`/login`}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </Link>
          }
        </CardContent>
      </Card>
    </Container>
  )
}

export default VerifyAccount