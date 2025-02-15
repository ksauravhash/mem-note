import { Button, Card, Grid2 as Grid, CardContent, Container, LinearProgress, Typography, Fab, Link } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { Notifications, Whatshot, BarChart, Add as AddIcon } from "@mui/icons-material";
import axiosInstance from "../utility/axiosInstance"
import axios from "axios"
import AddNoteForm from "../components/AddNoteForm";
import { Link as RouterLink } from 'react-router';


type noteParams = {
  noteId: string
}

type noteType = {
  title: string;
  noteblocks: noteBlock[],
  repetition: number;
  easeFactor: number;
  interval: number;
  usedDate: Date;
  previouslyUsed: boolean;
}

type notebookDataType = {
  _id: string;
  notes: noteType[];
  title: string;
  streakStart?: string;
  lastStreak?: string;
}

const findStreakLength = (start?: string, end?: string) => {
  if (!start)
    return 0;
  if (end) {
    const startDate = new Date(start);
    const endDate = new Date(start);
    const diff = endDate.getTime() - startDate.getTime();
    if (diff < 0)
      return 0;
    else
      return Math.floor(diff / 60 / 60 / 24) + 1;
  }
  return 0;
}

const Note = () => {
  const params = useParams<noteParams>();
  const [notebookData, setNotebookData] = useState<notebookDataType>();
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const navigation = useNavigate();

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const getNotebook = async () => {
    try {
      const data = (await axiosInstance.post('/notebook/getNotebook', {
        id: params.noteId
      })).data as { notebook: notebookDataType }
      setNotebookData(data.notebook);
      const usedNotesCount = data.notebook.notes.filter(e => e.previouslyUsed).length;
      if (data.notebook.notes.length == 0) {
        setProgress(100);
      } else {
        setProgress(Math.round(usedNotesCount * 100 / data.notebook.notes.length));
      }
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
  }, [])
  if (!notebookData)
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
              <Typography variant="h4" color="error" sx={{ fontWeight: "bold" }}>{findStreakLength(notebookData.streakStart, notebookData.lastStreak)} 🔥</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Stats */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ minHeight: '250px' }}>
            <CardContent>
              <BarChart color="secondary" fontSize="x-large" />
              <Typography variant="h6" sx={{ mt: 2 }}>Stats</Typography>
              <Typography variant="body1">Total Completion: &nbsp;
                <Typography component={'span'} color="secondary" style={{ fontWeight: "bold" }}>{progress}%</Typography>
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
            <Link component={RouterLink} to={`/review/${params.noteId}`}>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>Start Studying</Button>
            </Link>
          </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Fab variant="extended" size="large" sx={{
        position: "fixed",
        right: '1rem',
        bottom: '1rem'
      }}
        onClick={() => { setShowModal(true) }}>
        <AddIcon />
        Add a note
      </Fab>
      <AddNoteForm showModal={showModal} handleClose={handleCloseModal} notebookID={notebookData._id} />
    </Container>
  )
}

export default Note