// src/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit"; // Import combineReducers
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";

// 1. Combine all your reducers FIRST
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer, // Use the original cartReducer here
});

// 2. Redux Persist configuration for the ROOT reducer
const persistConfig = {
  key: "root", // Key for localStorage - often 'root' for the whole app
  storage,
  whitelist: ["cart"], // THIS IS CORRECT: It tells redux-persist to only save the 'cart' *slice* of your root state
  // If you also wanted to persist auth:
  // whitelist: ["cart", "auth"],
};

// 3. Create a persisted version of your ROOT reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure the Redux store with the PERSISTED ROOT REDUCER
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted root reducer here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5. Create a persistor for the store
export const persistor = persistStore(store);
