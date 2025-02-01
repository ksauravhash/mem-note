import { Button, Card, Grid2 as Grid, CardContent, Container, LinearProgress, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { Notifications, Whatshot, BarChart } from "@mui/icons-material";
import axiosInstance from "../utility/axiosInstance"
import axios from "axios"

type noteParams = {
  noteId: string
}

type noteBlock = {
  type: "word" | "image" | "audio";
  content: string;
  sequenceNumber: number;
}

type noteType = {
  title: string;
  noteblocks: noteBlock[]
}

type notebookDataType = {
  _id: string;
  notes: noteType[];
  title: string;
}

const Note = () => {
  const params = useParams<noteParams>();
  const [notebookData, setNotebookData] = useState<notebookDataType>();
  const navigation = useNavigate();

  /**
   * @todo To replace the dummy value with api response. 
   */
  const [streak, setStreak] = useState(5);
  const [progress, setProgress] = useState(70);

  const getNotebook = async () => {
    try {
      const data = (await axiosInstance.post('/notebook/getNotebook', {
        id: params.noteId
      })).data as { notebook: notebookDataType }
      setNotebookData(data.notebook);
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        if (err.response?.status == 400) {
          navigation('/notFound');
        }
      }
      console.log(err);
    }

  }
  useEffect(() => {
    getNotebook();
  })
  if(!notebookData)
    return <></>
  return (
    <Container sx={{ p: 4 }}>
      <Typography color="textSecondary" variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>{notebookData?.title}</Typography>

      <Grid container spacing={3}>
        {/* Daily Review */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }} >
          <Card sx={{ minHeight: '250px' }}>
            <CardContent>
              <Whatshot color="error" fontSize="x-large" />
              <Typography variant="h6" sx={{ mt: 2 }}>Daily Streak</Typography>
              <Typography variant="h4" color="error" sx={{ fontWeight: "bold" }}>{streak} 🔥</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Stats */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ minHeight: '250px' }}>
            <CardContent>
              <BarChart color="secondary" fontSize="x-large" />
              <Typography variant="h6" sx={{ mt: 2 }}>Stats</Typography>
              <Typography variant="body1">Total Completion:
                <Typography color="secondary" style={{ fontWeight: "bold" }}>{progress}%</Typography>
              </Typography>
              <LinearProgress variant="determinate" value={progress} color="primary" sx={{ mt: 2, bgcolor: "#333", height: 10, borderRadius: 5 }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Study Reminder */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ minHeight: '250px' }}><CardContent>
            <Notifications color="warning" fontSize="x-large" />
            <Typography variant="h6" sx={{ mt: 2 }}>Learning Reminder</Typography>
            <Typography variant="body1">Time to review your flashcards!</Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>Start Studying</Button>
          </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Note