import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePormise = loadStripe(
  "pk_test_51NVvzjFX2nhlT3cNQflnXdHIhjpqoNFdhvCEeVcvhQLDj1WUNyeU7mhXhrZVMEEUOugbwl1QqnM19ZcUuTxpppb000SABvtsJc"
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Elements stripe={stripePormise}>
      <App />
    </Elements>
  </React.StrictMode>
);
