import React from 'react';
import './styles/App.css';

import FileReader from './components/fileReader';
import Map from './components/map';
import Instruction from './components/instruction';

function App() {
  return (
    <div className="App">
      <h1 className="logo">Your Places</h1>
      <Instruction />
      <FileReader />
      <Map />
    </div>
  );
}

export default App;
