import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import userReducer from "./slices/userSlice";
import productApi from "./slices/productSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  [productApi.reducerPath]: productApi.reducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(productApi.middleware),
});

export const persistor = persistStore(store);
export default store;
