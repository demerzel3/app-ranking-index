import "./index.css";

import {
    CategoryScale,
    Chart,
    Decimation,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from "chart.js";
import ZoomPlugin from "chartjs-plugin-zoom";
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { sendToVercelAnalytics } from "./vitals";

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Legend,
    Decimation,
    Filler,
    Tooltip,
    ZoomPlugin
);

const root = createRoot(document.getElementById("root")!);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

reportWebVitals(sendToVercelAnalytics);
