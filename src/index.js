import { dbService } from "fbase";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
console.log(dbService)
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
