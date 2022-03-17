import React from 'react'
import { useHistory } from 'react-router-dom'

const AboutScreen = () => {
    const history = useHistory();
  return (
    <div id="AboutScreen">
        <div >
            <button id="return" onClick={()=>{history.push("/")}}></button>
        </div>
    </div>
  )
}

export default AboutScreen