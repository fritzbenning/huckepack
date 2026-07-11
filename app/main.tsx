import { ConvexAuthProvider } from "@convex-dev/auth/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/manrope";
import "react-beautiful-color/dist/react-beautiful-color.css";

import App from "./App";
import { convex } from "./lib/convex";
import "./shared/styles/application.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexAuthProvider client={convex}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConvexAuthProvider>
  </React.StrictMode>
);
