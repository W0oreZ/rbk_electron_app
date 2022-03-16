import React, { useEffect, useState } from 'react';

const MainView = () => {
    const [count, setCount] = useState(0);
    const [status, setStatus] = useState("ON");
    const [runTime, setRunTime] = useState();
    const [timer, setTimer] = useState(null);
    useEffect(()=> {
        setTimer(setInterval(()=>{
            setRunTime(window.rbk.getRunTime());
        },1000));

        window.rbk.onDeviceStatusChange((data)=>{
            setStatus(data.status)
            if(data.status === "OP DONE") {
                setTimeout(()=> {
                    setStatus("ON")
                }, 1200)
            }

            if(data.status === "OP START") {
                setCount(prevCount=>{
                    return ++prevCount;
                })
            }


            
        })

        return () => {
            clearInterval(timer);
        }
    }, [])
  return (
    <>
        <div className='screen'>
            <div className="side">
                <h1>STATUS</h1>
                <p>{status}</p>
                <div className='status-footer'>
                    <button className='btn btn-secondary'> Settings </button>
                </div>
            </div>
            <div className="params">
                <div className="card">
                    <div className="card-title">Temperature</div>
                    <div className="card-content">
                        499 °C
                    </div>
                </div>
                <div className="card">
                    <div className="card-title">Cycle Time</div>
                    <div className="card-content">
                        09.5 s
                    </div>
                </div>
                <div className="card">
                    <div className="card-title">UP Time</div>
                    <div className="card-content">
                        {runTime}
                    </div>
                </div>
                <div className="card">
                    <div className="card-title">Cycle Count</div>
                    <div className="card-content">
                        {count}
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-primary" onClick={()=>setCount(0)}>Reset</button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default MainView