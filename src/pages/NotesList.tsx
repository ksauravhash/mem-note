import { Edit as EditIcon } from "@mui/icons-material"
import { Container, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Pagination, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import axiosInstance from "../utility/axiosInstance"
import { AxiosError } from "axios"
import { useNavigate, useParams } from "react-router"
import Loading from "../components/Loading"
import UpdateNoteForm from "../components/UpdateNoteForm"

type ParamType = {
  notebookID: string
}


type noteType = {
  _id: string;
  title: string;
  noteblocks: noteBlock[],
  repetition: number;
  easeFactor: number;
  interval: number;
  usedDate: Date;
  previouslyUsed: boolean;
}

type noteStatsType = {
  notesCount: number;
  usedNotesCount: number,
  progress: number;
}

const pageLimit = 15;

const NotesList = () => {
  const [notes, setNotes] = useState<noteType[]>([]);
  const [notebookStats, setNotebookStats] = useState<noteStatsType>();
  const [loading, setLoading] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string>('');
  const [page, setPage] = useState(1);

  const params = useParams<ParamType>()

  const navigation = useNavigate();

  const handleChange = async (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setLoading(true);
    try {
      const resp = await axiosInstance.get(`/note/getNotes/${params.notebookID}/${value}`);
      setNotes(resp.data as noteType[]);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response.status == 400) {
          navigation('/notFound')
        } else
          if (err.response && err.response?.status >= 500) {
            navigation('/serverError');
          }
      }
      else {
        console.log(err);
      }
    }
    setLoading(false);

  };

  const handleClick= (id: string) => {
    setSelectedNoteId(id)
    setShowNoteModal(true);    
  }

  const handleClose = ()=> {
    setShowNoteModal(false);
  }



  const getNotes = async () => {
    try {
      setLoading(true);
      const resp = await axiosInstance.get(`/note/getNotes/${params.notebookID}/1`);
      const resp2 = await axiosInstance.post('/notebook/getNotbookWithStats', { id: params.notebookID });
      setNotes(resp.data as noteType[]);
      setNotebookStats(resp2.data as noteStatsType);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response.status == 400) {
          navigation('/notFound')
        } else
          if (err.response && err.response?.status >= 500) {
            navigation('/serverError');
          }
      }
      else {
        console.log(err);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    getNotes();
  }, [])

  if (loading)
    return <Loading />

  return (
    <Container sx={{ p: 4, pt: 6, maxHeight: '100%' }}>
      <Typography variant="h3" sx={{ mb: 2 }}>Notes</Typography>
      <List dense sx={{ maxHeight: '70vh', overflow: 'scroll', my: 4 }}>
        {
          notes.map((item) => (
            <ListItem key={item._id}>
              <ListItemButton onClick={()=> {handleClick(item._id)}}>
                <ListItemText>
                  {item.title}
                </ListItemText>
                <ListItemIcon><EditIcon /></ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))
        }
      </List>
      <Pagination page={page} count={notebookStats ? Math.ceil(notebookStats.notesCount / pageLimit) : 1} onChange={handleChange}></Pagination>
      <UpdateNoteForm notebookID={params.notebookID as string} showModal={showNoteModal} handleClose={handleClose} noteId={selectedNoteId}/>
    </Container>
  )
}

export default NotesList