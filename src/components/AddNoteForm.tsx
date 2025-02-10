import { DndContext, DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Container, Dialog, Fab, Paper, SelectChangeEvent, useMediaQuery, useTheme } from "@mui/material"
import React, { useState } from "react";
import SortableInput from "./SortableInput";
import { Add as AddIcon } from "@mui/icons-material";

export type FormElement = {
  id: number;
  type: NoteBlockType;
  content: string;
  sequenceNumber: number;
  answer: boolean;
}

const AddNoteForm = ({ showModal, handleClose }: { showModal: boolean, handleClose: () => void }) => {
  const [formElements, setFormElements] = useState<FormElement[]>([]);
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

  const handleAddButton: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setFormElements((prev) => [...prev, { id: prev.length, content: '', type: 'word', sequenceNumber: prev.length, answer: false }]);
  }

  const handleInputChange = (id: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    setFormElements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [e.target.name]: e.target.value } : item))
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  )

  const handleDialogClose = () => {
    setFormElements([]);
    handleClose();
  }

  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Dialog open={showModal} fullScreen={md} onClose={handleDialogClose}>
      <Container sx={{ p: 4 }}>
        <Paper
          sx={{ p: 4, }}
        >
          {/* Drag and Drop Context */}
          <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext items={formElements} strategy={verticalListSortingStrategy}>
              {formElements.map((item) => (
                <SortableInput key={item.id} {...item} handleInputChange={handleInputChange} />
              ))}
            </SortableContext>
          </DndContext>

          {/* Add Button */}
          <Container sx={{ display: "flex", justifyContent: "center", }}>
            <Fab
              variant="extended"
              onClick={handleAddButton}
              sx={{
                px: 3,
                py: 1,
              }}
            >
              <AddIcon sx={{ mr: 1 }} /> Add a Note Block
            </Fab>
          </Container>
        </Paper>
      </Container>
    </Dialog>
  )
}

export default AddNoteForm