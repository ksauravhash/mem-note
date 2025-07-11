import { Container, Typography, Divider, Box, useTheme, Paper, Grid, Card, CardContent, alpha, Fade, Grow } from "@mui/material";
import { Memory, Lightbulb, Star, Feedback, EmojiObjects, Psychology, DevicesOther } from "@mui/icons-material";
import { useState, useEffect } from "react";

const About = () => {
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <Fade in={loaded} timeout={800}>
      <Container maxWidth="md" sx={{ p: 4, pt: 6, mt: 3 }}>
        <Box sx={{ 
          textAlign: "center", 
          mb: 6,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.2)})`,
          borderRadius: 2,
          p: 4,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`
        }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2
            }}
          >
            About MemNote
          </Typography>
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary, maxWidth: "80%", mx: "auto" }}>
            Your intelligent companion for effective learning and knowledge retention
          </Typography>
        </Box>

        <Divider sx={{ my: 4, borderColor: alpha(theme.palette.primary.main, 0.3) }} />

        {/* Introduction */}
        <Grow in={loaded} timeout={1000}>
          <Card elevation={4} sx={{ 
            mb: 4, 
            borderRadius: 2,
            background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.9)})`,
            backdropFilter: "blur(10px)",
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <EmojiObjects fontSize="large" color="primary" sx={{ mr: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  What is MemNote?
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
                MemNote is an intuitive flashcard-based learning tool designed to help you retain knowledge efficiently.
                Inspired by Anki but with our unique style, MemNote makes learning engaging, customizable, and seamless.
                Our approach combines cognitive science principles with modern design to create the ultimate learning experience.
              </Typography>
            </CardContent>
          </Card>
        </Grow>

        {/* Features */}
        <Grow in={loaded} timeout={1200}>
          <Card elevation={4} sx={{ 
            mb: 4, 
            borderRadius: 2,
            background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.9)})`,
            backdropFilter: "blur(10px)",
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Star fontSize="large" color="primary" sx={{ mr: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  Why Use MemNote?
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ 
                    p: 3, 
                    height: "100%", 
                    borderRadius: 2,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: `0 12px 20px ${alpha(theme.palette.common.black, 0.15)}`
                    }
                  }}>
                    <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                      <Psychology color="primary" sx={{ fontSize: 40, mb: 2 }} />
                      <Typography variant="h6" gutterBottom>Spaced Repetition</Typography>
                      <Typography variant="body2">
                        Scientifically proven algorithm for optimal retention and long-term memory formation
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ 
                    p: 3, 
                    height: "100%", 
                    borderRadius: 2,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: `0 12px 20px ${alpha(theme.palette.common.black, 0.15)}`
                    }
                  }}>
                    <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                      <DevicesOther color="primary" sx={{ fontSize: 40, mb: 2 }} />
                      <Typography variant="h6" gutterBottom>Cross-Device Sync</Typography>
                      <Typography variant="body2">
                        Seamlessly sync your progress across all your devices, never lose your learning progress
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ 
                    p: 3, 
                    height: "100%", 
                    borderRadius: 2,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: `0 12px 20px ${alpha(theme.palette.common.black, 0.15)}`
                    }
                  }}>
                    <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                      <Memory color="primary" sx={{ fontSize: 40, mb: 2 }} />
                      <Typography variant="h6" gutterBottom>Customizable Notes</Typography>
                      <Typography variant="body2">
                        Create rich, interactive flashcards with images, formatting, and custom study schedules
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grow>

        {/* Why MemNote? */}
        <Grow in={loaded} timeout={1400}>
          <Card elevation={4} sx={{ 
            mb: 4, 
            borderRadius: 2,
            background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.default, 0.9)})`,
            backdropFilter: "blur(10px)",
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Lightbulb fontSize="large" color="primary" sx={{ mr: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  Why MemNote Over Other Flashcard Apps?
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
                Unlike traditional flashcard apps, MemNote enhances the learning experience with a visually engaging UI, a seamless workflow,
                and powerful customization options tailored to your study habits. We've designed MemNote with both effectiveness and enjoyment in mind,
                making your learning journey not just productive but also pleasurable.
              </Typography>
            </CardContent>
          </Card>
        </Grow>

        {/* Feedback */}
        <Grow in={loaded} timeout={1600}>
          <Card elevation={4} sx={{ 
            borderRadius: 2,
            background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
            backdropFilter: "blur(10px)",
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Feedback fontSize="large" color="primary" sx={{ mr: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  Get Involved!
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
                MemNote is constantly evolving! Have a suggestion? Let us know – your feedback helps shape the future of this app.
                Join our community of learners and contribute to making MemNote the best learning tool available.
              </Typography>
            </CardContent>
          </Card>
        </Grow>
      </Container>
    </Fade>
  );
};

export default About;
