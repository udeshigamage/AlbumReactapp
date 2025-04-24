import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import SearchPhotoForm from "./SearchphotoForm";

interface AddPhotomodelProps {
  open: boolean;
  handleClose: () => void;
  selectedalbumid: string | null;
}

function AddPhotomodel({
  open,
  handleClose,
  selectedalbumid,
}: AddPhotomodelProps) {
  const queryClient = useQueryClient();

  const handlePhotoInsert = async (photo: {
    id: string;
    name: string;
    date: string;
    url: string;
  }) => {
    try {
      await axios.post("http://localhost:3001/photos", {
        ...photo,
        albumId: selectedalbumid,
      });

      // Refresh photos in the album
      queryClient.invalidateQueries({ queryKey: ["photos", selectedalbumid] });
      handleClose();
    } catch (error) {
      console.error("Failed to insert photo:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      sx={{ zIndex: 2000 }}
    >
      <DialogTitle>Insert a Photo from Unsplash</DialogTitle>
      <DialogContent>
        {selectedalbumid ? (
          <SearchPhotoForm
            selectedAlbumId={selectedalbumid}
            onPhotoInsert={handlePhotoInsert}
          />
        ) : (
          <Typography color="error">Please select an album first.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddPhotomodel;
