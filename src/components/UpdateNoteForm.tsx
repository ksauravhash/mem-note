import { DndContext, DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Button, Container, Dialog, Paper, SelectChangeEvent, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import React, { MouseEventHandler, useContext, useEffect, useState } from "react";
import SortableInput from "./SortableInput";
import { Add as AddIcon } from "@mui/icons-material";
import axiosInstance from "../utility/axiosInstance";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { AlertContext } from "./AlertSystem";
import Loading from "./Loading";

type UpdateNoteType = {
  showModal: boolean;
  handleClose: () => void;
  notebookID: string;
  noteId: string
}

export type FormElement = {
  id: number;
  type: NoteBlockType;
  content: string;
  sequenceNumber: number;
  answer: boolean;
}

const UpdateNoteForm = ({ showModal, handleClose, notebookID, noteId }: UpdateNoteType) => {
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  const alertOb = useContext(AlertContext);

  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));


  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id == over.id) return;
    const activeIndex = formElements.findIndex(item => item.id == active.id);
    const overIndex = formElements.findIndex(item => item.id == over?.id);
    if (overIndex == -1) return;

    setFormElements(prev => {
      const newArr = arrayMove([...prev], activeIndex, overIndex);
      [newArr[activeIndex].sequenceNumber, newArr[overIndex].sequenceNumber] = [newArr[overIndex].sequenceNumber, newArr[activeIndex].sequenceNumber];
      return newArr;
    });
  }

  const handleAddButton: React.MouseEventHandler<HTMLButtonElement> = (_) => {
    setFormElements((prev) => [...prev, { id: prev.length, content: '', type: 'word', sequenceNumber: prev.length, answer: false }]);
  }

  const handleInputChange = (id: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    setFormElements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [e.target.name]: e.target.value } : item))
    );
  }

  const handleCheckboxChange = (id: number, e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFormElements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [e.target.name]: checked } : item))
    );
  }

  const handleRemoveButton = (id: number, _: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setFormElements((prev) => (
      prev.filter(item => item.id !== id)
    ))
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  )

  const handleDialogClose = () => {
    setFormElements([]);
    setTitle('');
    handleClose();
  }

  const handleSave: MouseEventHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.patch('/note/updateNote', {
        title: title,
        noteBlocks: formElements,
        notebookID: notebookID,
        noteId: noteId
      })
      handleDialogClose();
      alertOb?.pushAlert('You have successfully updated your note.', 'success');
    } catch (err) {
      if (err instanceof AxiosError) {
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

  const loadNote = async () => {
    setLoading(true);
    try {
      const resp = await axiosInstance.get(`/note/getNoteById/${notebookID}/${noteId}`);
      const data = resp.data as {
        title: string,
        noteBlocks: FormElement[]
      };
      setTitle(data.title);
      setFormElements(data.noteBlocks);
    } catch (err) {
      if (err instanceof AxiosError) {
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
    if(showModal)
      loadNote();
  }, [noteId, notebookID, showModal])

  if(loading)
    return <Loading/>

  return (
    <Dialog open={showModal} fullScreen={md} onClose={handleDialogClose}>
      <Container sx={{ p: 4 }}>
        <Paper
          sx={{ p: 4, }}
        >
          <form>

            <Typography variant="h3" sx={{ mb: 2 }}>Add a note</Typography>
            <TextField sx={{ mb: 4 }} value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required fullWidth />
            {/* Drag and Drop Context */}
            <Typography variant="h5" sx={{ mb: 2 }}>Noteblocks</Typography>

            <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
              <SortableContext items={formElements} strategy={verticalListSortingStrategy}>
                {formElements.map((item) => (
                  <SortableInput
                    key={item.id} {...item}
                    handleInputChange={handleInputChange}
                    handleCheckboxChange={handleCheckboxChange}
                    handleRemoveButton={handleRemoveButton}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {/* Add Button */}
            <Container sx={{ display: "flex", justifyContent: "center", }}>
              <Button
                variant="contained"
                onClick={handleAddButton}
                sx={{
                  px: 3,
                  py: 1,
                }}
              >
                <AddIcon sx={{ mr: 1 }} /> Add a Note Block
              </Button>
              {!mobile &&
                <Button variant="contained" sx={{ ml: 2 }} onClick={handleSave} type="submit" disabled={loading}>{loading ? 'Loading...' : 'Save'}</Button>
              }
            </Container>
            {mobile &&
              <Container sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <Button variant="contained" sx={{ ml: 2 }} onClick={handleSave} type="submit" disabled={loading}>{loading ? 'Loading...' : 'Save'}</Button>
              </Container>
            }
          </form>
        </Paper>
      </Container >
    </Dialog >
  )
}

export default UpdateNoteForm