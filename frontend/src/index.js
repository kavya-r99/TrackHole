
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// IMPORT BOOTSTRAP CSS & JS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// IMPORT GLOBAL CSS Theme
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

