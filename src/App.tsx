import React from 'react';
import Router from './Router'
import { ColorModeProvider } from './Context/ColorModeContext';
import './custom.scss';


function App() {
  return (
    <div className="App">
      <ColorModeProvider>
        <Router />
      </ColorModeProvider>
    </div>
  );
}

export default App;
