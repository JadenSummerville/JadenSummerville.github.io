import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import Door from './Door.js';
//import './App.css';

function App() {
  const doorElevation = '100px';

  const [numOfBarricades, setNumOfBarricades] = useState(0);

  let time = 1;
  useEffect(() => {
    // Set up a timer to trigger the alert every 3 seconds
    const alertTimer = setInterval(() => {
      alert(time);
      time++;
    }, 60000);

    // Clean up the timer when the component unmounts
    return () => clearInterval(alertTimer);
  }, []);

  return (
    <div className="App">
      <Door initialIsBarricaded = {true} style={{ position: 'absolute', top: doorElevation, left: '100px' }} numOfBarricades={numOfBarricades} setNumOfBarricades={setNumOfBarricades}/>
      <Door style={{ position: 'absolute', top: doorElevation, left: '300px' }} numOfBarricades={numOfBarricades} setNumOfBarricades={setNumOfBarricades}/>
      <Door style={{ position: 'absolute', top: doorElevation, left: '500px' }} numOfBarricades={numOfBarricades} setNumOfBarricades={setNumOfBarricades}/>
      <Door style={{ position: 'absolute', top: doorElevation, left: '700px' }} numOfBarricades={numOfBarricades} setNumOfBarricades={setNumOfBarricades}/>
    </div>
  );
}

export default App;
