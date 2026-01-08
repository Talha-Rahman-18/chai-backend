import React from "react";
function Input({
    placeholder,
    color,
    border,
    height,
    width,
    label,
    type="text",
    ...props

},ref) {
    return (
        <div className="input">
            {label && <label
            >
                {label}
                </label>
                }

                <input type={type} 
                placeholder={placeholder}
                ref={ref}
                {...props}
                style={{color:color,border:border,height:height,width:width,...props}}
                
                />
                
        </div>
    )
}

export default React.forwardRef(Input);
