import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Place {
  id: string;
  name: string;
  coordinates: [number, number];
}

interface PlacesState {
  places: Place[];
  loading: boolean;
  error: string | null;
}

const initialState: PlacesState = {
  places: [],
  loading: false,
  error: null,
};

export const fetchPlaces = createAsyncThunk(
  "places/fetchPlaces",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://64fa30874098a7f2fc15737d.mockapi.io/place_search");
      if (!response.ok) throw new Error("Failed to fetch places");
      const data = await response.json();
      return data.map((p: { id: string; name: string; coordinates: number[] }) => ({
        id: p.id,
        name: p.name,
        coordinates: [p.coordinates[0], p.coordinates[1]] as [number, number],
      }));
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch places");
    }
  }
);

const placesSlice = createSlice({
  name: "places",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.places = action.payload;
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default placesSlice.reducer;