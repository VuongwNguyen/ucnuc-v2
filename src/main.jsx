import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/UcnucContext.jsx";

createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <CartProvider>
        <App />
    </CartProvider>
  // </React.StrictMode>
);
