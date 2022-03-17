import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import MainScreen from './pages/MainScreen';
import AboutScreen from './pages/AboutScreen';
import MenuScreen from './pages/MenuScreen';
import ConfigScreen from './pages/ConfigScreen';

function App() {
  const [status, setStatus] = useState({
    temperature: 500,
    count: 0,
    countdown: 10,
    display: "ON"
  });

  const [timer, setTimer] = useState(null);
  const [runTime, setRunTime] = useState();

  useEffect(()=> {
    setTimer(setInterval(async ()=>{
        setRunTime(await window.rbk.getRunTime());
    },1000));

    window.rbk.onDeviceStatusChange((data) => {
        console.log(data);
        setStatus({
            temperature:data.temperature,
            count:data.count,
            countdown:data.countdown,
            display:data.status
        })
    })

    return () => {
        clearInterval(timer);
    }
}, [])

  return (
    <>
      <Switch>
        <Route exact path="/" render={(props) => <MainScreen {...props} {...status} runTime={runTime} />} />
        <Route exact path="/config" render={(props) => <ConfigScreen {...props} {...status} />} />
        <Route exact path="/menu" render={(props) => <MenuScreen {...props} />} />
        <Route exact path="/about" render={(props) => <AboutScreen {...props} />} />
      </Switch>
    </>
  );
}

export default App;
