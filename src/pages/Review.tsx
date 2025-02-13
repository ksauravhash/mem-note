import { Box, Button, Card, CardContent, CardMedia, Container, Grid2 as Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import axiosInstance from "../utility/axiosInstance";
import Loading from "../components/Loading";
import axios, { AxiosError } from "axios";

type reviewParams = {
  notebookID: string
}

type reviewNoteType = {
  _id: string;
  easeFactor: number;
  interval: number;
  noteBlocks: noteBlock[],
  previouslyUsed: boolean;
  repetition: number;
  title: string;
  usedDate: string;
  count: number;
}

const Review = () => {
  const [reviewData, setReviewData] = useState<reviewNoteType[]>([]);
  const [currentSelection, setCurrentSelection] = useState(0);
  const [successList, setSuccessList] = useState<number[]>([]);
  const [failList, setFailList] = useState<number[]>([]);
  const [randomMovement, setRandomMovement] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useParams<reviewParams>();
  const navigation = useNavigate();

  const goNext = () => {
    let nextSelection = null;

    if (!randomMovement) {
      if (currentSelection + 1 < reviewData.length) {
        nextSelection = currentSelection + 1;
      } else {
        setRandomMovement(true);
      }
    }

    if (nextSelection === null && failList.length > 0) {
      nextSelection = failList[0];
    }

    if (nextSelection === null && successList.length > 0) {
      nextSelection = successList[0];
    }

    if (nextSelection !== null) {
      setCurrentSelection(nextSelection);
    } else {
      setTimeout(()=>{
        setReviewData([]); // Only reset when there’s nothing left

      }, 1000);
    }
  };

  const handleDifficultButton = async () => {
    setFailList(prev => {
      if (!prev.includes(currentSelection)) {
        return [...prev, currentSelection];
      } else {
        return [...prev.slice(1), currentSelection]; // Remove first, push to the end
      }
    });
  
    setSuccessList(prev => prev.includes(currentSelection) ? prev.slice(1) : prev);
  
    try {
      await axiosInstance.patch('/note/iterateNote', {
        notebookID: params.notebookID,
        noteID: reviewData[currentSelection]._id,
        quality: 0
      });
  
      setReviewData(prev => prev.map((note, index) => 
        index === currentSelection ? { ...note, count: 0 } : note
      ));
  
      goNext(); // Move to next selection after state updates
    } catch (err) {
      if (err instanceof AxiosError && err.response && err.response?.status >= 500) {
        navigation('/serverError');
      } else {
        console.log(err);
      }
    }
  };

  const handleEasyButton = async () => {
    if (failList.includes(currentSelection)) {
      setFailList(prev => prev.slice(1)); // Remove first element (shorthand)
    }

    setSuccessList(prev=> {
      let prev1 = [...prev];
      if(successList.includes(currentSelection))
        prev1 = prev1.slice(1)
      if(reviewData[currentSelection].count < 2)
        prev1 = [...prev1, currentSelection];
      return prev1;
    })

    try {
      if (reviewData[currentSelection].count >= 2) {
        await axiosInstance.patch('/note/iterateNote', {
          notebookID: params.notebookID,
          noteID: reviewData[currentSelection]._id,
          quality: 4
        });
      } else {
        setReviewData(prev => {
          return prev.map((note, index) =>
            index === currentSelection
              ? { ...note, count: note.count + 1 }  // Create a new object instead of mutating
              : note
          );
        });
      }
      goNext();
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response?.status >= 500) {
          navigation('/serverError');
        }
      } else {
        console.log(err);
      }
    }
  };

  const handleDataRetrieval = async () => {
    setLoading(true);
    try {
      const resp = await axiosInstance.get(`/note/getUnusedNotes/${params.notebookID}`);
      const resp2 = await axiosInstance.get(`/note/getTodaysNote/${params.notebookID}`);
      const data: reviewNoteType[] = [...resp.data, ...resp2.data];
      data.forEach(item => {
        item.count = 0;
      })
      setReviewData(data);
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        if (err.response?.status == 400) {
          navigation('/notFound');
        }
      } else {
        navigation('/serverError');
      }
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const returnBlockFrontend = (block: noteBlock, index: number) => {
    if (block.type === "word") {
      return (
        <Typography key={index} variant="body1" sx={{ mb: 1 }}>
          {block.content}
        </Typography>
      );
    } else if (block.type === "description") {
      return (
        <Typography key={index} variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {block.content}
        </Typography>
      );
    } else if (block.type === "image") {
      return (
        <CardMedia
          key={index}
          component="img"
          image={block.content}
          alt="Image"
          sx={{
            width: "100%", // Ensures it scales properly
            maxHeight: 300, // Prevents overly tall images
            objectFit: "cover", // Keeps aspect ratio
            borderRadius: 2,
            mb: 2,
          }}
        />
      );
    }
  }

  useEffect(() => {
    handleDataRetrieval();
  }, [])

  if (loading)
    return <Loading />

  return (
    <Container sx={{ p: 4, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Typography variant="h2">
        Review
      </Typography>
      {reviewData.length === 0 ? (
        <Typography textAlign="center">There is nothing in this notebook to be reviewed.</Typography>
      ) : (
        <Grid container justifyContent="center" alignItems="center" sx={{ flexGrow: 1 }}>
          <Grid size={{ xs: 12, sm: 10, md: 8, lg: 6 }} sx={{ height: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Card
              variant="outlined"
              sx={{
                margin: "auto",
                width: "100%",
                maxWidth: 500,
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                {reviewData[currentSelection].title}
              </Typography>

              {reviewData[currentSelection].noteBlocks.map((block, index) => {
                if (!block.answer) {
                  return returnBlockFrontend(block, index);
                } else {
                  return (
                    <Box key={index} sx={{ opacity: showAnswer ? 1 : 0, transition: "opacity 0.3s ease-in-out" }}>
                      {returnBlockFrontend(block, index)}
                    </Box>
                  );
                }
              })}

              <CardContent sx={{ width: "100%", textAlign: "center", pb: "0!important" }}>
                <Button variant="contained" onClick={() => setShowAnswer((prev) => !prev)}>
                  {showAnswer ? "Hide Answer" : "Show Answer"}
                </Button>
              </CardContent>
            </Card>

            <Grid container spacing={2} sx={{ maxWidth: 500, mt: 2 }}>
              <Grid>
                <Button color="error" onClick={handleDifficultButton}>
                  Can't remember
                </Button>
              </Grid>
              <Grid>
                <Button color="success" onClick={handleEasyButton}>
                  Easy
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Container>

  )
}

export default Review