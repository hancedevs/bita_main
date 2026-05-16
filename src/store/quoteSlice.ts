import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export type VehicleType = "MOTORBIKE" | "BICYCLE" | "FOOT";
export type ServiceType = "CITY" | "DOMESTIC" | "INTERNATIONAL";

export interface PriceResponse {
  price: number;
  distanceMeters: number;
  distanceKm: number;
  durationSeconds: number;
  deliveryType: VehicleType;
  serviceType: ServiceType;
  breakdown: {
    baseFare: number;
    distanceCharge: number;
    ratePerKm: number;
    via: string;
  };
}

interface QuoteState {
  quotes: {
    MOTORBIKE: PriceResponse | null;
    BICYCLE: PriceResponse | null;
    FOOT: PriceResponse | null;
  };
  selectedVehicle: VehicleType | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuoteState = {
  quotes: { MOTORBIKE: null, BICYCLE: null, FOOT: null },
  selectedVehicle: null,
  loading: false,
  error: null,
};

const VEHICLE_MAP: Record<VehicleType, string> = {
  MOTORBIKE: "MOTORBIKE",
  BICYCLE: "BICYCLE",
  FOOT: "FOOT",
};

export const fetchQuotes = createAsyncThunk(
  "quote/fetchQuotes",
  async ({ pickupCoords, deliveryCoords, serviceType = "CITY" }: { pickupCoords: [number, number]; deliveryCoords: [number, number]; serviceType?: ServiceType }, { rejectWithValue, getState }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BOOKING_API_URL;
      const token = (getState() as { auth: { token: string | null } }).auth.token;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      
      const fetchPrice = async (vehicleType: VehicleType): Promise<PriceResponse> => {
        const response = await fetch(`${baseUrl}/price/calculate`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            pickupLat: pickupCoords[0],
            pickupLng: pickupCoords[1],
            deliveryLat: deliveryCoords[0],
            deliveryLng: deliveryCoords[1],
            deliveryType: VEHICLE_MAP[vehicleType],
            serviceType,
          }),
        });
        
        if (!response.ok) throw new Error(`Failed to fetch price for ${vehicleType}`);
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to fetch price");
        return result.data;
      };

      const [motorbike, bicycle, foot] = await Promise.all([
        fetchPrice("MOTORBIKE"),
        fetchPrice("BICYCLE"),
        fetchPrice("FOOT"),
      ]);

      return { MOTORBIKE: motorbike, BICYCLE: bicycle, FOOT: foot };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch quotes");
    }
  }
);

const quoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: {
    selectVehicle: (state, action) => {
      state.selectedVehicle = action.payload;
    },
    clearQuotes: (state) => {
      state.quotes = { MOTORBIKE: null, BICYCLE: null, FOOT: null };
      state.selectedVehicle = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotes.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes = action.payload;
        state.selectedVehicle = "MOTORBIKE";
      })
      .addCase(fetchQuotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectVehicle, clearQuotes } = quoteSlice.actions;
export default quoteSlice.reducer;