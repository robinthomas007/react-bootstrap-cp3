import React from "react";
import Router from "./Router";
import { ColorModeProvider } from "./Context/ColorModeContext";
import { AuthProvider } from "./Context/authContext";
import Toaster from './Components/Common/Toaster';

import "./custom.scss";
// import "./poc.scss"

let url = "https://api.dev.cp3.umgapps.com/api/";

switch (process.env.REACT_APP_ENV) {
  case "dev":
    url = "https://api.dev.cp3.umgapps.com/api/";
    break;
  case "qa":
    url = "https://api.qa.cp3.umgapps.com/api/";
    break;
  case "uat":
    url = "https://api.uat.cp3.umgapps.com/api/";
    break;
  case "prod":
    url = "https://api.cp3.umgapps.com/api/";
    break;
}

export const BASE_URL = url;

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <ColorModeProvider>
          <Toaster />
          <Router />
        </ColorModeProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
