import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import authReducer from "./state";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"; //configureStore is used to create the Redux store
import { Provider } from "react-redux"; //The Provider component wraps your React application and provides access to the Redux store to all the components in your app via the React context API.
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"; //Redux Persist is used to persist and rehydrate the Redux store, allowing it to survive page refreshes and app restarts.
import storage from "redux-persist/lib/storage"; //uses the browser's localStorage to persist the Redux store's state.
import { PersistGate } from "redux-persist/integration/react"; //The PersistGate is used to wrap your application and control the persistence and rehydration of the Redux store.

const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
