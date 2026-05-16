import { configureStore } from "@reduxjs/toolkit";
import trackingReducer from "./trackingSlice";
import placesReducer from "./placesSlice";
import quoteReducer from "./quoteSlice";
import bookingReducer from "./bookingSlice";
import issueReducer from "./issuesSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    tracking: trackingReducer,
    places: placesReducer,
    quote: quoteReducer,
    booking: bookingReducer,
    issues: issueReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;