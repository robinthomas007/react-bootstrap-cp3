import React from 'react';
import Router from './Router'
import { ColorModeProvider } from './Context/ColorModeContext';
import { AuthProvider } from './Context/authContext';
import './custom.scss';


function App() {
  return (
    <div className="App">
      <AuthProvider>
        <ColorModeProvider>
          <Router />
        </ColorModeProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
