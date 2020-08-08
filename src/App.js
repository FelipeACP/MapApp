import React from 'react';
import './App.css';

import FileReader from './components/fileReader';
import Map from './components/map';

function App() {
  return (
    <div className="App">
      Your Places
      <FileReader />
      <Map />
    </div>
  );
}

export default App;
