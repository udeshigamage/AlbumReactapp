import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Album {
  id: string;
  name: string;
}

interface AlbumState {
  albums: Album[];
}

const initialState: AlbumState = {
  albums: [],
};

const albumSlice = createSlice({
  name: "album",
  initialState,
  reducers: {
    setAlbums: (state, action: PayloadAction<Album[]>) => {
      state.albums = action.payload;
    },
    addAlbum: (state, action: PayloadAction<Album>) => {
      state.albums.push(action.payload);
    },
  },
});

export const { setAlbums, addAlbum } = albumSlice.actions;
export default albumSlice.reducer;
