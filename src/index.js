import React from "react";
import ReactDOM from "react-dom";
// Provider HOC
import { Web3ReactProvider } from "@web3-react/core";
// Provider to communicate with Eth
import { Web3Provider } from "@ethersproject/providers";

import "./index.css";
import App from "./App";

const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <App />
  </Web3ReactProvider>,
  document.getElementById("root")
);
