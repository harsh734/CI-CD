import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskApi } from '../api/taskApi';

const readErr = (err) =>
  err?.response?.data?.message || err?.message || 'Request failed';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await taskApi.getAll();
      return res.data;
    } catch (err) {
      return rejectWithValue(readErr(err));
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await taskApi.create(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(readErr(err));
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, ...patch }, { rejectWithValue }) => {
    try {
      const res = await taskApi.update(id, patch);
      return res.data;
    } catch (err) {
      return rejectWithValue(readErr(err));
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id, { rejectWithValue }) => {
    try {
      await taskApi.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(readErr(err));
    }
  }
);

export const toggleTask = createAsyncThunk(
  'tasks/toggle',
  async (id, { getState, rejectWithValue }) => {
    const current = getState().tasks.items.find((t) => t.id === id);
    if (!current) return rejectWithValue('Task not found');
    const next = current.status === 'completed' ? 'active' : 'completed';
    try {
      const res = await taskApi.update(id, { status: next });
      return res.data;
    } catch (err) {
      return rejectWithValue(readErr(err));
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearTasks(state) {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchTasks.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload; })
      .addCase(fetchTasks.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })

      .addCase(createTask.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(updateTask.fulfilled, (s, a) => {
        const idx = s.items.findIndex((t) => t.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(toggleTask.fulfilled, (s, a) => {
        const idx = s.items.findIndex((t) => t.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(deleteTask.fulfilled, (s, a) => {
        s.items = s.items.filter((t) => t.id !== a.payload);
      });
  },
});

export const { clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
