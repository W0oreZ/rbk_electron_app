import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';

const ConfigScreen = ({ temperature, countdown }) => {
  const history = useHistory();
  const [t, setT] = useState(temperature);
  const [c, setC] = useState(countdown);

  useEffect(() => {
    if(t<200){
      setT(200)
    }

    if(t>600)
      setT(600)
  
  }, [t])

  useEffect(() => {
    if(c<1){
      setC(1)
    }

    if(c>60)
      setC(60)
  
  }, [c])
  
    

  return (
    <div id="ConfigScreen">
         <div id="defaultTemperature">{t}</div>
        <div id="CycleTime">{c}</div>
        <div >
            <button id="buttonApply" onClick={()=>{window.rbk.sendCommand({type:"config", payload:{temp:t,countDown:c}});history.push("/")}}></button>
        </div>
        <div >
            <button id="return" onClick={()=>{history.push("/")}}></button>
        </div>

        <div >
            <button id="plusTemperature" onClick={()=>setT(o=>o+5)}></button>
        </div>
        <div >
            <button id="minusTemperature" onClick={()=>setT(o=>o-5)}></button>
        </div>

        <div >
            <button id="plusCycle" onClick={()=>setC(o=>o+0.5)}></button>
        </div>
        <div >
            <button id="minusCycle" onClick={()=>setC(o=>o-0.5)}></button>
        </div>

        <div >
            <button id="reset" onClick={()=>{window.rbk.sendCommand({type:"raz-count"});history.push("/")}}></button>
        </div>
    </div>
  )
}

export default ConfigScreen