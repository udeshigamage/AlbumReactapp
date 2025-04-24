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
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Album {
  id: string;
  name: string;
}

interface Photo {
  id: string;
  name: string;
  url: string;
  date: string;
}

function Rootcomponent() {
  const queryClient = useQueryClient();

  const [isAlbumAddmodelopen, setAlbumAddmodelopen] = useState(false);
  const [isPhotoAddmodelopen, setPhotoAddmodelopen] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  // Fetch Albums
  const fetchAlbums = async (): Promise<Album[]> => {
    const response = await axios.get("http://localhost:3001/albums");
    return response.data;
  };
  const fetchimages = async () => {
    await axios.get("https://unsplash.com/developers");
  };
  const {
    data: albums = [],
    isLoading: loadingAlbums,
    error: albumsError,
    refetch: refetchAlbums,
  } = useQuery({
    queryKey: ["albums"],
    queryFn: fetchAlbums,
  });

  // Fetch Photos of selected album
  const fetchPhotos = async (albumId: string): Promise<Photo[]> => {
    const response = await axios.get(
      `http://localhost:3001/photos?albumId=${albumId}`
    );
    return response.data;
  };

  const {
    data: queriedPhotos = [],
    isLoading: loadingPhotos,
    error: photosError,
  } = useQuery({
    queryKey: ["photos", selectedAlbumId],
    queryFn: () => fetchPhotos(selectedAlbumId!),
    enabled: !!selectedAlbumId,
  });
  useEffect(() => {});
  return (
    <Box>
      <Grid container height="100vh">
        {/* Left Panel - Albums */}
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
          ) : albumsError ? (
            <Typography color="error">Failed to load albums</Typography>
          ) : (
            <List dense sx={{ mt: 2 }}>
              {albums.map((album) => (
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

        {/* Right Panel - Photos */}
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
              // disabled={!selectedAlbumId}
            >
              Add Photo
            </Button>
          </Box>

          {loadingPhotos ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress size={28} />
            </Box>
          ) : photosError ? (
            <Typography color="error">Failed to load photos</Typography>
          ) : queriedPhotos.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {selectedAlbumId ? "No photos found in this album." : ""}
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {queriedPhotos.map((photo) => (
                <Grid item key={photo.id} xs={12} sm={6} md={4}>
                  <Box
                    component="img"
                    src={photo.url}
                    alt={photo.name}
                    sx={{ width: "100%", borderRadius: 1, mb: 1 }}
                  />
                  <Typography variant="subtitle1" fontWeight={600}>
                    {photo.name}
                  </Typography>
                  <Typography variant="caption">📅 {photo.date}</Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Modals */}
      <AddAlbummodel
        open={isAlbumAddmodelopen}
        handleClose={() => {
          setAlbumAddmodelopen(false);
          refetchAlbums(); // Refetch albums after modal close
        }}
      />
      <AddPhotomodel
        open={isPhotoAddmodelopen}
        selectedalbumid={selectedAlbumId}
        handleClose={() => {
          setPhotoAddmodelopen(false);
          queryClient.invalidateQueries({
            queryKey: ["photos", selectedAlbumId],
          }); // Refresh photos
        }}
      />
    </Box>
  );
}

export default Rootcomponent;
