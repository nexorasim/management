import { configureStore } from '@reduxjs/toolkit';
import profileSlice from './profileSlice';

export const store = configureStore({
  reducer: {
    profiles: profileSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;