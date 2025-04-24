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
import { useState } from "react";
import AddAlbummodel from "./AddAlbummodel";
import AddPhotomodel from "./AddPhotomodel";
import axios from "axios";
import moment from "moment";

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

  return (
    <>
      <Grid
        container
        sx={{ height: "100vh", minWidth: "100vw", overflow: "hidden" }}
      >
        {/* Left Panel - Albums */}
        <Grid
          item
          xs={3}
          sx={{
            borderRight: "1px solid #e0e0e0",
            p: 3,
            bgcolor: "#f9f9f9",
            display: "flex",
            color: "black",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Albums
          </Typography>

          <Button
            fullWidth
            variant="contained"
            sx={{ borderRadius: 2, mb: 2 }}
            onClick={() => setAlbumAddmodelopen(true)}
          >
            Add Album
          </Button>

          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            {loadingAlbums ? (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress size={24} />
              </Box>
            ) : albumsError ? (
              <Typography color="error">Failed to load albums</Typography>
            ) : (
              <List dense>
                {albums.map((album) => (
                  <ListItem key={album.id} disablePadding>
                    <ListItemButton
                      selected={selectedAlbumId === album.id}
                      onClick={() => setSelectedAlbumId(album.id)}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        "&.Mui-selected": {
                          bgcolor: "#1976d2",
                          color: "#fff",
                          "&:hover": { bgcolor: "#1565c0" },
                        },
                      }}
                    >
                      <ListItemText primary={album.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Grid>

        {/* Right Panel - Photos */}
        <Grid
          item
          xs={9}
          sx={{
            p: 4,
            overflowY: "auto",
            bgcolor: "#ffffff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" fontWeight="bold">
              {selectedAlbumId ? "Photos in Album" : "Select an Album"}
            </Typography>
            <Button
              variant="contained"
              disabled={!selectedAlbumId}
              onClick={() => setPhotoAddmodelopen(true)}
              sx={{ borderRadius: 2 }}
            >
              Add Photo
            </Button>
          </Box>

          {loadingPhotos ? (
            <Box display="flex" justifyContent="center" mt={6}>
              <CircularProgress size={28} />
            </Box>
          ) : photosError ? (
            <Typography color="error">Failed to load photos</Typography>
          ) : queriedPhotos.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              {selectedAlbumId ? "No photos found in this album." : ""}
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {queriedPhotos.map((photo) => (
                <Grid item key={photo.id} xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: 1,
                      bgcolor: "#fafafa",
                    }}
                  >
                    <Box
                      component="img"
                      src={photo.url}
                      alt={photo.name}
                      sx={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        borderBottom: "1px solid #eee",
                      }}
                    />
                    <Box sx={{ p: 2 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        color={"black"}
                      >
                        {photo.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        📅 {moment(photo.date).format("MMMM Do YYYY")}
                      </Typography>
                    </Box>
                  </Box>
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
          refetchAlbums();
        }}
      />
      <AddPhotomodel
        open={isPhotoAddmodelopen}
        selectedalbumid={selectedAlbumId}
        handleClose={() => {
          setPhotoAddmodelopen(false);
          queryClient.invalidateQueries({
            queryKey: ["photos", selectedAlbumId],
          });
        }}
      />
    </>
  );
}

export default Rootcomponent;
