import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { spinAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const spinWheel = createAsyncThunk('spin/spin', async (_, { rejectWithValue }) => {
  try {
    const res = await spinAPI.spin();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Spin failed');
  }
});

export const fetchLastSpin = createAsyncThunk('spin/fetchLast', async (_, { rejectWithValue }) => {
  try {
    const res = await spinAPI.getLastSpin();
    return res.data;
  } catch (err) {
    return rejectWithValue(null);
  }
});

const spinSlice = createSlice({
  name: 'spin',
  initialState: {
    result: null,
    lastSpin: null,
    canSpin: true,
    loading: false,
    error: null,
  },
  reducers: {
    clearSpinResult: (state) => { state.result = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(spinWheel.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(spinWheel.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
        state.canSpin = false;
        state.lastSpin = action.payload;
      })
      .addCase(spinWheel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (action.payload?.includes('already')) state.canSpin = false;
        toast.error(action.payload || 'Spin failed');
      });

    builder
      .addCase(fetchLastSpin.fulfilled, (state, action) => {
        state.lastSpin = action.payload;
        // If spun today, disable
        if (action.payload?.date) {
          const today = new Date().toDateString();
          const spinDate = new Date(action.payload.date).toDateString();
          state.canSpin = today !== spinDate;
        }
      });
  },
});

export const { clearSpinResult } = spinSlice.actions;
export default spinSlice.reducer;
