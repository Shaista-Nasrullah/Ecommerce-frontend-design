import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import AppContextProvider from "./context/AppContext.jsx";
import { store, persistor } from "./store"; // Import store and persistor
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppContextProvider>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </AppContextProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
