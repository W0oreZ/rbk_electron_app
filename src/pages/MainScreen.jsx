import React, { useState }  from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
function getDate(){
  const currentDate = new Date();

  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
  const currentYear = currentDate.getFullYear();
  
  const dateString = days[currentDate.getDay()-1] +"        "+currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear;
  return dateString;
}

function getTime() {
  const currentDate = new Date();

  return currentDate.getHours()+ ":" + currentDate.getMinutes();
}

const MainScreen = ({temperature, countdown, count, display, runTime}) => {
  const history = useHistory();
  const [datetime, setDatetime ] = useState({
    date:getDate(),
    time:getTime()
  })

  
  return (
    <div id="dashboard">
        <div id="numberTemp">{temperature} °C</div>
        <div id="numberCycleTime">{countdown} s</div>
        <div id="numberCycleCount">{count}</div>
        <div id="datetime"> &emsp;&emsp;&emsp;&ensp;{datetime.time}<br />{datetime.date}</div>
        <div id="fullname">APTIV OPERATOR</div>
        <div id="Opstart">{display}</div>
        <div id="upTime">upTime : {runTime}</div>
        <div>
          <button id="param" onClick={()=>{history.push("/menu")}}></button>
        </div>
    </div>
  )
}

export default MainScreen