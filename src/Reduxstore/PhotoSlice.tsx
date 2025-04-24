import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Photo {
  id: string;
  albumId: string;
  name: string;
  url: string;
  date: string;
}

interface PhotoState {
  photos: Photo[];
}

const initialState: PhotoState = {
  photos: [],
};

const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    setPhotos: (state, action: PayloadAction<Photo[]>) => {
      state.photos = action.payload;
    },
    addPhoto: (state, action: PayloadAction<Photo>) => {
      state.photos.push(action.payload);
    },
  },
});

export const { setPhotos, addPhoto } = photoSlice.actions;
export default photoSlice.reducer;
