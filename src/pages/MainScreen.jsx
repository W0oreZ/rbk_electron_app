import React  from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const MainScreen = ({temperature, countdown, count, display, runTime}) => {
  const history = useHistory();
  
  return (
    <div id="dashboard">
        <div id="numberTemp">{temperature} °C</div>
        <div id="numberCycleTime">{countdown} s</div>
        <div id="numberCycleCount">{count}</div>
        <div id="datetime"> &emsp;&emsp;&emsp;&ensp;18:34<br />Monday 17 mars 2022</div>
        <div id="fullname">Bouskoura Mohamed</div>
        <div id="Opstart">{display}</div>
        <div id="upTime">upTime : {runTime}</div>
        <div>
          <button id="param" onClick={()=>{history.push("/menu")}}></button>
        </div>
    </div>
  )
}

export default MainScreen