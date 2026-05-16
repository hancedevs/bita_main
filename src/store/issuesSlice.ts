import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export type IssueType =
  | "DAMAGED_ITEM"
  | "MISSING_ITEM"
  | "LATE_DELIVERY"
  | "WRONG_ADDRESS"
  | "PACKAGE_NOT_RECEIVED"
  | "OTHER";

export interface IssueReportRequest {
  trackingNumber: string;
  issueType: IssueType;
  email: string;
  phone: string;
  description: string;
}

export interface IssueReportResponse {
  success: boolean;
  message: string;
  data?: {
    issueId: string;
    referenceNumber: string;
  };
}

interface IssueState {
  reportData: IssueReportResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: IssueState = {
  reportData: null,
  loading: false,
  error: null,
};

export const reportIssue = createAsyncThunk(
  "issues/reportIssue",
  async (data: IssueReportRequest, { rejectWithValue, getState }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BOOKING_API_URL;
      const token = (getState() as { auth: { token: string | null } }).auth.token;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(`${baseUrl}/issues`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to report issue");
      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to report issue");
    }
  }
);

const issueSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    clearIssueReport: (state) => {
      state.reportData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(reportIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reportIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.reportData = action.payload;
      })
      .addCase(reportIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearIssueReport } = issueSlice.actions;
export default issueSlice.reducer;