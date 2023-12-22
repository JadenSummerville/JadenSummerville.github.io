import React, { useEffect, useState } from 'react';
import logo from './logo.svg';

function Door({ initialIsBarricaded = false, style, numOfBarricades, setNumOfBarricades}) {
    const [isBarricaded, setIsBarricaded] = useState(initialIsBarricaded);
    let barricaded = "Unbarricaded!";
    if(isBarricaded){
      barricaded = "barricaded";
    }
    const unberricadeAttempt = () => {
      if(isBarricaded){
        setIsBarricaded(false);
        setNumOfBarricades(numOfBarricades+1);
        return;
      }
    }
    const berricadeAttempt = () => {
      if(isBarricaded || numOfBarricades === 0){
        return;
      }
      setIsBarricaded(true);
      setNumOfBarricades(numOfBarricades-1);
    }
    const leftClick = (e) => {
      berricadeAttempt();
    }
    const rightClick = (event) => {
      // Prevent the default context menu from appearing
      event.preventDefault();
      unberricadeAttempt();
    };
  return (
    <div className="Door" style={style} onContextMenu={(e) => rightClick(e)} onClick={(e) => leftClick(e)}>
      <p>{barricaded}</p>
      {/*<p style={{ position: 'absolute', top: '100px', left: '100px' }}>Test</p>*/}

    </div>
  );
}

export default Door;
