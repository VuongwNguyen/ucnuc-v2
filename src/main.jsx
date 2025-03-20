import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/UcnucContext.jsx";
import AuthProviderAdmin from "./context/AuthAdminContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <CartProvider>
      <AuthProviderAdmin>
        <App />
      </AuthProviderAdmin>
    </CartProvider>
  // </StrictMode>
);
