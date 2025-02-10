import { useSortable } from "@dnd-kit/sortable";
import { FormElement as FormElementType } from "./AddNoteForm";
import { Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, ListItem, MenuItem, Paper, Select, TextField } from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import { Clear as ClearIcon, DragIndicator as DragIndicatorIcon } from "@mui/icons-material";

const SortableInput = ({ id, content, type, handleInputChange }: FormElementType & { handleInputChange: (id: number, e: React.ChangeEvent<any>) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });
  const menuItems: NoteBlockType[] = ["word", "description"];
  return (
    <Paper ref={setNodeRef} sx={{ transform: CSS.Transform.toString(transform), transition, touchAction: 'none' }}>
      <ListItem secondaryAction={
        <IconButton color="error">
          <ClearIcon />
        </IconButton>
      }>
        <DragIndicatorIcon   {...attributes} {...listeners} sx={{ cursor: 'move' }} />
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            label="Type"
            name='type'
            /**
             * @To-do fix this
             */
            onChange={(e) => { handleInputChange(id, e as any) }}
          >
            {menuItems.map((item, index) => (<MenuItem key={index} value={item}>{item}</MenuItem>))}
          </Select>
        </FormControl>
        <FormGroup sx={{ ml: 2 }}>
          <FormControlLabel value={"true"} control={<Checkbox />} label="Answer" labelPlacement="end" />
        </FormGroup>
      </ListItem>
      <ListItem>
        {type === "word" ? (
          <TextField fullWidth placeholder='Enter something' name='content' value={content} onChange={(e) => { handleInputChange(id, e) }} />
        ) : (
          <TextField
            multiline
            fullWidth
            minRows={3}
            name='content'
            placeholder="Enter description..."
          />
        )}
      </ListItem>
    </Paper>
  )
}

export default SortableInput