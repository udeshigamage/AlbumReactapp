import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface AddAlbumModelProps {
  open: boolean;
  handleClose: () => void;
}
const AddAlbumModal: React.FC<AddAlbumModelProps> = ({ open, handleClose }) => {
  //const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    albumname: Yup.string().required("Album name is required"),
    title: Yup.string().required("Title is required"),
    date: Yup.date().required("Date is required"),
  });

  const addalbum = async (newalbum: any) => {
    await axios.post(`http://localhost:3001/albums`, newalbum);
  };
  const queryclient = useQueryClient();
  const addalbummutation = useMutation({
    mutationFn: (newalbum: any) => addalbum(newalbum),
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["albums"] });
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Album</DialogTitle>

      <Formik
        initialValues={{ albumname: "", title: "", date: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const albumvalues = {
              name: values.albumname,
              date: values.date,
            };

            await addalbummutation.mutate(albumvalues);

            resetForm();
            handleClose();
          } catch (err) {
            console.error("Error submitting form", err);
          }
        }}
      >
        {({ errors, touched, handleChange, values }) => (
          <Form>
            <DialogContent dividers>
              <TextField
                fullWidth
                name="albumname"
                label="Album Name"
                value={values.albumname}
                onChange={handleChange}
                error={touched.albumname && Boolean(errors.albumname)}
                helperText={touched.albumname && errors.albumname}
                margin="normal"
              />

              <TextField
                fullWidth
                name="title"
                label="Title"
                value={values.title}
                onChange={handleChange}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
                margin="normal"
              />

              <TextField
                fullWidth
                name="date"
                label="Date"
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

export default AddAlbumModal;
