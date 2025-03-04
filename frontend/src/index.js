import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
//import "./index.css";  // Общие стили

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AuthProvider> {/* Провайдер оборачивает всё приложение */}
            <App />
        </AuthProvider>
    </React.StrictMode>
);
