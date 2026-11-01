import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';

const readErr = (err) =>
  err?.response?.data?.message || err?.message || 'Request failed';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await authApi.login(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(readErr(err));
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await authApi.register(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(readErr(err));
    }
  }
);

export const fetchMeThunk = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.me();
      return res.data.user;
    } catch (err) {
      return rejectWithValue(readErr(err));
    }
  }
);

export const completeOnboardingThunk = createAsyncThunk(
  'auth/completeOnboarding',
  async (_, { rejectWithValue }) => {
    try {
      const res = await userApi.updateOnboarding(true);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(readErr(err));
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const onAuthSuccess = (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'succeeded';
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    };

    builder
      .addCase(loginThunk.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(loginThunk.fulfilled, onAuthSuccess)
      .addCase(loginThunk.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })

      .addCase(registerThunk.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(registerThunk.fulfilled, onAuthSuccess)
      .addCase(registerThunk.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })

      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchMeThunk.rejected, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      })

      .addCase(completeOnboardingThunk.pending, (state) => {
        if (state.user) state.user.onboardingCompleted = true;
      })
      .addCase(completeOnboardingThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
