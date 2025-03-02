import { Button, Card, Grid2 as Grid, CardContent, Container, LinearProgress, Typography, Fab, Link, Box, useTheme, useMediaQuery } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { Notifications, Whatshot, BarChart, Add as AddIcon, Settings as SettingsIcon } from "@mui/icons-material";
import axiosInstance from "../utility/axiosInstance"
import axios from "axios"
import AddNoteForm from "../components/AddNoteForm";
import { Link as RouterLink } from 'react-router';
import NotebookSettings from "../components/NotebookSettings";


type noteParams = {
  noteId: string
}

// type noteType = {
//   title: string;
//   noteblocks: noteBlock[],
//   repetition: number;
//   easeFactor: number;
//   interval: number;
//   usedDate: Date;
//   previouslyUsed: boolean;
// }

type notebookDataType = {
  _id: string;
  title: string;
  streakStart?: string;
  lastStreak?: string;
}

type noteStatsType = {
  notesCount: number;
  usedNotesCount: number,
  progress: number;
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
  const [stats, setStats] = useState<noteStatsType>({ notesCount: 0, usedNotesCount: 0, progress: 0 });
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const navigation = useNavigate();

  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down('md'));

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleCloseSettingsModal = ()=> {
    setShowSettingsModal(false);
  }

  const getNotebook = async () => {
    try {
      const data = (await axiosInstance.post('/notebook/getNotbookWithStats', {
        id: params.noteId
      })).data as {
        notebook: notebookDataType, notesCount: number;
        usedNotesCount: number,
      }
      setNotebookData(data.notebook);
      setStats(prev => {
        const ob = { ...prev, notesCount: data.notesCount, usedNotesCount: data.usedNotesCount };
        if (data.notesCount == 0) {
          ob.progress = 100;
        } else {
          ob.progress = (Math.round(data.usedNotesCount * 100 / data.notesCount));
        }
        return ob;
      })
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
    <Container sx={{ p: 4, pt: 6 }}>
      <Typography color="textSecondary" variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>{notebookData?.title}</Typography>

      <Grid container spacing={3}>
        {/* Daily Review */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }} >
          <Card sx={{ minHeight: '210px' }}>
            <CardContent>
              <Whatshot color="error" fontSize="x-large" />
              <Typography variant="h6" sx={{ mt: 2 }}>Daily Streak</Typography>
              <Typography variant="h4" color="error" sx={{ fontWeight: "bold" }}>{findStreakLength(notebookData.streakStart, notebookData.lastStreak)} 🔥</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Stats */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ minHeight: '210px' }}>
            <CardContent>
              <BarChart color="secondary" fontSize="x-large" />
              <Typography variant="h6" sx={{ mt: 2 }}>Stats</Typography>
              {
                stats.notesCount > 0 ? <>

                  <Typography variant="body1">Total Completion: &nbsp;
                    <Typography component={'span'} color="secondary" style={{ fontWeight: "bold" }}>{stats.progress}%</Typography>
                  </Typography>
                  <LinearProgress variant="determinate" value={stats.progress} color="primary" sx={{ mt: 2, bgcolor: "#333", height: 10, borderRadius: 5 }} />
                </> : <Typography variant="body1">No notes available</Typography>
              }
            </CardContent>
          </Card>
        </Grid>

        {/* Study Reminder */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ minHeight: '210px' }}><CardContent>
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
      <Box sx={{
        position: "fixed",
        right: '1rem',
        bottom: '1rem'
      }}>
        <Fab variant={!md ? 'extended' : 'circular'} size="large"
          sx={{
            mr: 2
          }}
          onClick={() => { setShowModal(true) }}>
          <AddIcon />
          {!md && "Add a note"}
        </Fab>
        <Fab variant={!md ? 'extended' : 'circular'} size="large"
          onClick={() => { setShowSettingsModal(true) }}>
          <SettingsIcon />
          {!md && "Settings"}
        </Fab>
      </Box>
      <AddNoteForm showModal={showModal} handleClose={handleCloseModal} notebookID={notebookData._id} />
      <NotebookSettings showModal={showSettingsModal} handleClose={handleCloseSettingsModal} notebookID={notebookData._id} title={notebookData.title}/>
    </Container>
  )
}

export default Note