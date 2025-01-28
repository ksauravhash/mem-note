import { Box } from "@mui/material"
import { useParams } from "react-router"

type noteParams = {
  noteId: string
}

const Note = () => {
  const params = useParams<noteParams>();
  if(params) {
    console.log(params.noteId);
  }
  return (
    <Box>Note</Box>
  )
}

export default Note