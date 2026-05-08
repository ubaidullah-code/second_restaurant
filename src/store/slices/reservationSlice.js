import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reservationAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const createReservation = createAsyncThunk(
  'reservations/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await reservationAPI.create(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Booking failed');
    }
  }
);

export const fetchMyReservations = createAsyncThunk(
  'reservations/fetchMy',
  async (id, { rejectWithValue }) => {
    try {
      const res = await reservationAPI.getUserReservations(id);
      console.log("res.data", res.data.data)
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load reservations');
    }
  }
);

export const cancelReservation = createAsyncThunk(
  'reservations/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const res = await reservationAPI.cancel(id);
      return { id, data: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Cancellation failed');
    }
  }
);

export const checkAvailability = createAsyncThunk(
  'reservations/checkAvailability',
  async ({ date, slot }, { rejectWithValue }) => {
    try {
      const res = await reservationAPI.checkAvailability(date, slot);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Cannot check availability');
    }
  }
);

const reservationSlice = createSlice({
  name: 'reservations',
  initialState: {
    list: [],
    loading: false,
    createLoading: false,
    cancelLoading: null,
    availability: null,
    availabilityLoading: false,
    error: null,
  },
  reducers: {
    clearAvailability: (state) => { state.availability = null; },
  },
  extraReducers: (builder) => {
    // Create
    builder
      .addCase(createReservation.pending, (state) => { state.createLoading = true; state.error = null; })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.createLoading = false;
        const res = action.payload.reservation || action.payload;
        state.list.unshift(res);
        toast.success('Reservation confirmed! 🎉');
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });

    // Fetch my
    builder
      .addCase(fetchMyReservations.pending, (state) => { state.loading = true; })
      .addCase(fetchMyReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload.data) ? action.payload.data : [];
      })
      .addCase(fetchMyReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Cancel
    builder
      .addCase(cancelReservation.pending, (state, action) => { state.cancelLoading = action.meta.arg; })
      .addCase(cancelReservation.fulfilled, (state, action) => {
        state.cancelLoading = null;
        const idx = state.list.findIndex((r) => r._id === action.payload.id);
        if (idx !== -1) state.list[idx].status = 'cancelled';
        toast.success('Reservation cancelled');
      })
      .addCase(cancelReservation.rejected, (state, action) => {
        state.cancelLoading = null;
        toast.error(action.payload);
      });

    // Availability
    builder
      .addCase(checkAvailability.pending, (state) => { state.availabilityLoading = true; state.availability = null; })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.availabilityLoading = false;
        state.availability = action.payload;
      })
      .addCase(checkAvailability.rejected, (state) => {
        state.availabilityLoading = false;
        state.availability = null;
      });
  },
});

export const { clearAvailability } = reservationSlice.actions;
export default reservationSlice.reducer;
