import React from 'react'
import './Button.css'

function Button({text,
    type="Button",
    width,
    height,
    ...props}) {
    return (
        <button {...props} style={{width:width,height:height,...props}}>
            {text}
        </button>
    )
}

export default Button
