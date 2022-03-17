import React from 'react'
import { useHistory } from 'react-router-dom';

const MenuScreen = () => {
    const history = useHistory();
  return (
    <div id="MenuScreen">
        <div>
            <button id="configuration" onClick={()=>{history.push("/config")}}></button>
        </div>
        <div >
            <button id="info" onClick={()=>{history.push("/about")}}></button>
        </div>
        <div >
            <button id="return" onClick={()=>{history.push("/")}}></button>
        </div>
    </div>
  )
}

export default MenuScreen