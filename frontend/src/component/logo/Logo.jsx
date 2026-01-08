import React from 'react'
import tuminol from './tuminol.jpeg'
import './Logo.css'
import { Link } from 'react-router-dom'

function Logo() {


    return (
        <Link className='logomain' to={'/'}>
        <div className="logomain">
<img src={tuminol} alt="Tuminol" />
        </div>
        </Link>
    )
}

export default Logo
