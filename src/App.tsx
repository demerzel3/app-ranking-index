import "./App.css";

import React from "react";

import { Chart } from "./Chart";

function App() {
    return (
        <div className="App" style={{ height: window.innerHeight }}>
            <Chart />
        </div>
    );
}

export default App;
