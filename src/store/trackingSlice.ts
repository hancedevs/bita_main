import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchTrackingInfo } from "@/lib/services/tracking-api";

export interface ShipmentEvent {
  id: string;
  shipmentId: string;
  status: string;
  locationText: string | null;
  lat: string | null;
  lng: string | null;
  actorId: string;
  timestamp: string;
}

export interface ShipmentData {
  trackingNumber: string;
  status: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  packageType: string;
  weight: string;
  latestEvent: ShipmentEvent;
  events: ShipmentEvent[];
}

interface TrackingState {
  data: ShipmentData | null;
  loading: boolean;
  error: string | null;
  trackingNumber: string | null;
}

const initialState: TrackingState = {
  data: null,
  loading: false,
  error: null,
  trackingNumber: null,
};

export const trackShipment = createAsyncThunk(
  "tracking/trackShipment",
  async (trackingNumber: string, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as { auth: { token: string | null } }).auth.token;
      const data = await fetchTrackingInfo(trackingNumber, token || undefined);
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch tracking info");
    }
  }
);

const trackingSlice = createSlice({
  name: "tracking",
  initialState,
  reducers: {
    clearTracking: (state) => {
      state.data = null;
      state.error = null;
      state.trackingNumber = null;
    },
    setTrackingNumber: (state, action: PayloadAction<string>) => {
      state.trackingNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(trackShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(trackShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.trackingNumber = action.payload.trackingNumber;
      })
      .addCase(trackShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTracking, setTrackingNumber } = trackingSlice.actions;
export default trackingSlice.reducer;