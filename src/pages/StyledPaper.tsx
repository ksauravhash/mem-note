import { Paper, styled } from "@mui/material";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  margin: "auto",
  marginTop: theme.spacing(8),
  boxShadow: theme.shadows[5],
}));

export default StyledPaper;