import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import reservationReducer from './slices/reservationSlice';
import spinReducer from './slices/spinSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    reservations: reservationReducer,
    spin: spinReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
