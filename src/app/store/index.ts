import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import authReducer from '@features/auth/store/authSlice';
import counterReducer from '@features/counter/store/counterSlice';
import { baseApi } from '@services/baseApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: import.meta.env.DEV,
});

// Enable refetchOnFocus / refetchOnReconnect for RTK Query
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
