import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  emailOrPhone: string;
  password: string;
}

export interface VerifyRequest {
  phone: string;
  otp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    phone: string;
    token?: string;
    user?: User;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  pendingPhone: string | null;
  loading: boolean;
  verifying: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  pendingPhone: null,
  loading: false,
  verifying: false,
  error: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_AUTH_API_URL;
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Registration failed");
      }
      return result.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Registration failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_AUTH_API_URL;
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Login failed");
      }
      return result.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Login failed");
    }
  }
);

export const verifyLogin = createAsyncThunk(
  "auth/verifyLogin",
  async (data: VerifyRequest, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_AUTH_API_URL;
      const response = await fetch(`${baseUrl}/auth/verify-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Verification failed");
      }
      return result.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Verification failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.pendingPhone = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.pendingPhone = null;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingPhone = action.payload?.phone ?? null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingPhone = action.payload?.phone ?? null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyLogin.pending, (state) => {
        state.verifying = true;
        state.error = null;
      })
      .addCase(verifyLogin.fulfilled, (state, action) => {
        state.verifying = false;
        state.user = action.payload?.user ?? null;
        state.token = action.payload?.token ?? null;
        state.pendingPhone = null;
      })
      .addCase(verifyLogin.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;