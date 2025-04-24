import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import axios from "axios";
const Accesskey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const validationSchema = Yup.object({
  query: Yup.string().required("Search term is required"),
});

interface SearchPhotoFormProps {
  selectedAlbumId: string | null;
  onPhotoInsert: (photo: any) => void;
}

function SearchPhotoForm({
  selectedAlbumId,
  onPhotoInsert,
}: SearchPhotoFormProps) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${Accesskey}`
      );
      setPhotos(response.data.results);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={4}>
      <Formik
        initialValues={{ query: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSearch(values.query)}
      >
        {() => (
          <Form>
            <Field
              as={TextField}
              name="query"
              label="Search Unsplash Photos"
              fullWidth
              //error={<ErrorMessage name="query" /> ? true : false}
              helperText={<ErrorMessage name="query" />}
            />
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              type="submit"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </Form>
        )}
      </Formik>

      {photos.length > 0 && (
        <>
          <Typography variant="h6" mt={4}>
            Search Results
          </Typography>
          <Grid container spacing={2} mt={1}>
            {photos.map((photo) => (
              <Grid item key={photo.id} xs={12} sm={6} md={4}>
                <Card>
                  <CardMedia
                    component="img"
                    height="180"
                    image={photo.urls.small}
                    alt={photo.alt_description}
                  />
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {photo.alt_description || "Untitled"}
                    </Typography>
                    <Typography variant="caption">
                      {new Date(photo.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      disabled={!selectedAlbumId}
                      onClick={() =>
                        onPhotoInsert({
                          id: photo.id,
                          name: photo.alt_description || "Untitled",
                          date: new Date(photo.created_at).toISOString(),
                          url: photo.urls.small,
                        })
                      }
                    >
                      Add to Album
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}

export default SearchPhotoForm;
