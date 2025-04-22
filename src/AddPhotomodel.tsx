import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface AddPhotomodelProps {
  open: boolean;
  handleClose: () => void;
  selectedalbumid: any;
}
const AddPhotomodel: React.FC<AddPhotomodelProps> = ({
  open,
  handleClose,
  selectedalbumid,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const queryclient = useQueryClient();
  const addphoto = async (newphoto: any) => {
    await axios.post(`http://localhost:3001/photos`, newphoto);
  };
  const Addphotomutation = useMutation({
    mutationFn: (newphoto: any) => addphoto(newphoto),
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["photos"] });
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Photo to Album</DialogTitle>

      <Formik
        initialValues={{ date: "", description: "", photo: "" }}
        onSubmit={async (values, { resetForm }) => {
          try {
            setIsLoading(true);

            const photodata = {
              description: values.description,
              date: values.date,
              title: "Myphoto",
              albumId: selectedalbumid,
              file: values.photo,
            };

            Addphotomutation.mutateAsync(photodata);

            console.log("Photo submitted:", values);
            resetForm();
            handleClose();
          } catch (err) {
            console.error("Error adding photo", err);
          } finally {
            setIsLoading(false);
          }
        }}
      >
        {({
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          handleSubmit,
        }) => (
          <Form onSubmit={handleSubmit}>
            <DialogContent dividers>
              {/* File Upload */}
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  console.log("Selected file:", file); // ✅ check if file is there
                  setFieldValue("photo", file?.name);
                }}
              />
              {touched.photo && errors.photo && (
                <div style={{ color: "red", marginTop: 4 }}>{errors.photo}</div>
              )}

              {/* Description */}
              <TextField
                fullWidth
                name="description"
                label="Photo Description"
                multiline
                rows={3}
                value={values.description}
                onChange={handleChange}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                margin="normal"
              />

              {/* Date */}
              <TextField
                fullWidth
                name="date"
                label="Date Taken"
                type="date"
                value={values.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={touched.date && Boolean(errors.date)}
                helperText={touched.date && errors.date}
                margin="normal"
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Create
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddPhotomodel;
