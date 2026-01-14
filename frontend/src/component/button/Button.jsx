import React from 'react'
import './Button.css'

function Button({text,
    type="Button",
    width,
    height,
    color,
    display,
    backgroundColor,
    ...props}) {
    return (
        <button {...props} style={{width:width,height:height,color:color,backgroundColor:backgroundColor,display:display,...props}}>
            {text}
        </button>
    )
}

export default Button
