import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { VehicleType, ServiceType } from "./quoteSlice";

export type PaymentMethod = "CASH" | "TELEBIRR" | "CBE_BIRR";

export interface BookingRequest {
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupLat: number;
  pickupLng: number;
  deliveryLat: number;
  deliveryLng: number;
  packageType: string;
  weight: number;
  serviceType: ServiceType;
  deliveryType: VehicleType;
  paymentMethod: PaymentMethod;
  codAmount?: number;
}

export interface BookingResponse {
  id: string;
  trackingNumber: string;
  price: number;
  distanceMeters: number;
  status: string;
}

interface BookingState {
  bookingData: BookingResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookingData: null,
  loading: false,
  error: null,
};

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingData: BookingRequest, { rejectWithValue, getState }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BOOKING_API_URL;
      const token = (getState() as { auth: { token: string | null } }).auth.token;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(`${baseUrl}/shipments`, {
        method: "POST",
        headers,
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) throw new Error("Failed to create booking");
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || "Failed to create booking");
      }
      
      return result.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create booking");
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBooking: (state) => {
      state.bookingData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingData = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;