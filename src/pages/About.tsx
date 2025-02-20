import { Container, Typography, Divider, Box, useTheme } from "@mui/material";
import { Memory, Lightbulb, Star, Sync, Feedback } from "@mui/icons-material";

const About = () => {
  const theme = useTheme()
  return (
    <Container maxWidth="md" sx={{ color: "white", p: 4, pt: 6, mt:3 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
        About MemNote
      </Typography>

      <Divider sx={{ my: 2, borderColor: theme.palette.primary.main }} />

      {/* Introduction */}
      <Typography variant="h5" gutterBottom>
        <Lightbulb color="primary" sx={{ verticalAlign: "middle", mr: 1 }} />
        What is MemNote?
      </Typography>
      <Typography variant="body1" sx={{ m: "1rem" }}>
        MemNote is an intuitive flashcard-based learning tool designed to help you retain knowledge efficiently.
        Inspired by Anki but with our unique style, MemNote makes learning engaging, customizable, and seamless.
      </Typography>

      {/* Features */}
      <Typography variant="h5" gutterBottom>
        <Star color="primary" sx={{ verticalAlign: "middle", mr: 1 }} />
        Why Use MemNote?
      </Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        <Typography component="li" variant="body1">
          <Memory color="primary" sx={{ verticalAlign: "middle", mr: 1 }} /> Spaced Repetition for optimal retention.
        </Typography>
        <Typography component="li" variant="body1">
          <Sync color="primary" sx={{ verticalAlign: "middle", mr: 1 }} /> Sync across devices, so you never lose progress.
        </Typography>
        <Typography component="li" variant="body1">
          Customizable Notes & an Interactive UI for a seamless learning experience.
        </Typography>
      </Box>

      {/* Why MemNote? */}
      <Typography variant="h5" gutterBottom>
        <Lightbulb color="primary" sx={{ verticalAlign: "middle", mr: 1, }} />
        Why MemNote Over Other Flashcard Apps?
      </Typography>
      <Typography variant="body1" sx={{ m: "1rem" }}>
        Unlike traditional flashcard apps, MemNote enhances the learning experience with a visually engaging UI, a seamless workflow,
        and powerful customization options tailored to your study habits.
      </Typography>

      {/* Feedback */}
      <Typography variant="h5" gutterBottom>
        <Feedback color="primary" sx={{ verticalAlign: "middle", mr: 1 }} />
        Get Involved!
      </Typography>
      <Typography variant="body1" sx={{ m: "1rem" }}>
        MemNote is constantly evolving! Have a suggestion? Let us know – your feedback helps shape the future of this app.
      </Typography>
    </Container>
  );
};

export default About;
