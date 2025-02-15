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

type statusType = {
  currentSelection: number;
  successList: number[];
  failList: number[];
  randomMovement: boolean;
}

const Review = () => {
  const [reviewData, setReviewData] = useState<reviewNoteType[]>([]);
  const [status, setStatus] = useState<statusType>({
    currentSelection: 0,
    successList: [],
    failList: [],
    randomMovement: false
  });
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useParams<reviewParams>();
  const navigation = useNavigate();

  const goNext = async () => {
    setStatus(prev => {
      const prevOb = { ...prev };
      let { currentSelection, failList, randomMovement, successList } = prevOb;
      if (!randomMovement && currentSelection + 1 < reviewData.length) {
        prevOb.currentSelection++;
        return prevOb;
      }
      if (!randomMovement && currentSelection == reviewData.length - 1) {
        prevOb.randomMovement = true;
      }
      if (failList.length > 0) {
        prevOb.currentSelection = failList[0];
        return prevOb;
      }
      if (successList.length > 0) {
        prevOb.currentSelection = successList[0];
        return prevOb;
      }
      setReviewData([]);
      return prevOb;

    })
  }

  const handleDifficultButton = async () => {
    setStatus(prev => {
      const prevOb = { ...prev };
      const { currentSelection, failList, successList } = prevOb;
      if (successList.includes(currentSelection))
        successList.shift();
      if (failList.includes(currentSelection))
        failList.shift();
      failList.push(currentSelection);
      return prevOb;
    })

    try {
      await axiosInstance.patch('/note/iterateNote', {
        notebookID: params.notebookID,
        noteID: reviewData[status.currentSelection]._id,
        quality: 0
      });

      setReviewData(prev => prev.map((note, index) =>
        index === status.currentSelection ? { ...note, count: 0 } : note
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
    setStatus(prev => {
      const prevOb = { ...prev };
      const { currentSelection, failList, successList } = prevOb;
      if (failList.includes(currentSelection))
        failList.shift();
      if (successList.includes(currentSelection))
        successList.shift();
      if (reviewData[currentSelection].count < 2)
        successList.push(currentSelection);
      return prevOb;
    })

    try {
      if (reviewData[status.currentSelection].count >= 2) {
        await axiosInstance.patch('/note/iterateNote', {
          notebookID: params.notebookID,
          noteID: reviewData[status.currentSelection]._id,
          quality: 4
        });
      } else {
        setReviewData(prev => {
          return prev.map((note, index) =>
            index === status.currentSelection
              ? { ...note, count: note.count + 1 }
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
    <Container sx={{ p: 4, pt: 6, display: "flex", flexDirection: "column" }}>
      <Typography variant="h2">
        Review
      </Typography>
      {reviewData.length === 0 ? (
        <Container sx={{flexGrow: '1', display: 'flex', alignItems: 'center'}}>
          <Typography textAlign="center">There is nothing in this notebook to be reviewed.</Typography>
        </Container>
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
                {reviewData[status.currentSelection].title}
              </Typography>

              {reviewData[status.currentSelection].noteBlocks.map((block, index) => {
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