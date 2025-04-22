import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddAlbummodel from "./AddAlbummodel";
import AddPhotomodel from "./AddPhotomodel";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Album {
  id: string;
  name: string;
}

interface Photo {
  id: string;
  name: string;
  date: string;
}

function Rootcomponent() {
  const [isAlbumAddmodelopen, setAlbumAddmodelopen] = useState(false);
  const [isPhotoAddmodelopen, setPhotoAddmodelopen] = useState(false);
  const [albums_, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [loadingAlbums_, setLoadingAlbums] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  const fetchAlbums = async () => {
    setLoadingAlbums(true);

    try {
      const response = await axios.get("http://localhost:3001/albums"); // Replace with your API
      setAlbums(response.data);
      return response.data;
      console.log(albums);
    } catch (err) {
      console.error("Failed to fetch albums");
    } finally {
      setLoadingAlbums(false);
    }
  };

  const {
    data: albums,
    error,
    isLoading: loadingAlbums,
  } = useQuery({
    queryKey: ["albums"],
    queryFn: fetchAlbums,
  });

  const fetchPhotos = async (albumId: string) => {
    setLoadingPhotos(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/photos?albumId=${albumId}`
      );
      setPhotos(response.data);
    } catch (err) {
      console.error("Failed to fetch photos");
    } finally {
      setLoadingPhotos(false);
    }
  };

  useEffect(() => {
    if (selectedAlbumId) {
      fetchPhotos(selectedAlbumId);
    }
  }, [selectedAlbumId]);

  return (
    <Box>
      <Grid container height="100vh">
        {/* Left Panel */}
        <Grid item xs={3} sx={{ borderRight: "1px solid #ccc", p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Albums
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setAlbumAddmodelopen(true)}
          >
            Add Album
          </Button>

          {loadingAlbums ? (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <List dense sx={{ mt: 2 }}>
              {albums.map((album: any) => (
                <ListItem key={album.id} disablePadding>
                  <ListItemButton
                    selected={selectedAlbumId === album.id}
                    onClick={() => setSelectedAlbumId(album.id)}
                  >
                    <ListItemText primary={album.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Grid>

        {/* Right Panel */}
        <Grid item xs={9} sx={{ p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">
              {selectedAlbumId ? "Photos in Album" : "Select an Album"}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setPhotoAddmodelopen(true)}
              disabled={!selectedAlbumId}
            >
              Add Photo
            </Button>
          </Box>

          {loadingPhotos ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress size={28} />
            </Box>
          ) : photos.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {selectedAlbumId ? "No photos found in this album." : ""}
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {/* {photos.map((photo) => (
                <Grid item key={photo.id} xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      height: "100%",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      📸 {photo.name}
                    </Typography>
                    <Typography variant="caption">📅 {photo.date}</Typography>
                  </Box>
                </Grid>
              ))} */}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Modals */}
      <AddAlbummodel
        open={isAlbumAddmodelopen}
        handleClose={() => {
          setAlbumAddmodelopen(false);
          fetchAlbums();
        }}
      />
      <AddPhotomodel
        open={isPhotoAddmodelopen}
        selectedalbumid={selectedAlbumId}
        handleClose={() => {
          setPhotoAddmodelopen(false);
          if (selectedAlbumId) fetchPhotos(selectedAlbumId);
        }}
      />
    </Box>
  );
}

export default Rootcomponent;
