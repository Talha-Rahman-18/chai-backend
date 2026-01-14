import React, { useState } from 'react'
import './ChangePassword.css'
import { useChangeCurrentPasswordMutation } from '../../services/user/userApi'
import Button from '../button/Button';

function ChangePassword({refetchuser}) {

const [form,setform] = useState({
    oldpassword:'',
    newpassword:'',
    confirmpassword:''
})

const [changeCurrentPassword]  = useChangeCurrentPasswordMutation();

const handlechange = (e)=>{
    const {name,value} = e.target;

    setform(prev=>({
        ...prev,
        [name]:value
    }));


};


const handlChangepass =async (e)=>{
e.preventDefault();

    if(form.newpassword !== form.confirmpassword){
        alert("New password and confirm password doesnt match")
        return;
    }
    try {
       
    await changeCurrentPassword({
        oldpassword:form.oldpassword,
        newpassword : form.newpassword,
        confirmpassword : form.confirmpassword
    }).unwrap();
           

    setform({
        oldpassword:'',
        newpassword:'',
        confirmpassword:''
    })
    alert("Successfully Changed password")
    refetchuser();

} catch (error) {
    alert(`Error in Update password,${error}`)
    console.log(`Error in Update password,${error}`)
}
}


    return (
        <div className="passchangemain">
            <div className="passtext">
                <h3>Password Change</h3>
                <p>Update Your Password</p>
            </div>
            <div className="passchangeform">
                <form id='passinfoform' onSubmit={handlChangepass}>

                <label htmlFor='oldpassword'>Old Password*</label>
                <input 
                type='password'
                id='oldpassword'
                name='oldpassword'
                value={form.oldpassword}
                onChange={handlechange}
                placeholder='Enter Current Password'
                />

            <label htmlFor='newpassword'>New Password*</label>
                <input 
                type='password'
                name='newpassword'
                value={form.newpassword}
                onChange={handlechange}
                placeholder='Enter a New Password'
                />

                <label htmlFor='confirmpassword'>Confirm Password*</label>
                <input 
                type='password'
                name='confirmpassword'
                value={form.confirmpassword}
                onChange={handlechange}
                placeholder='Enter Password Again'
                />

<div className="passbuttonsave">
    <Button type='submit' text={"save"} color={"white"} backgroundColor={"red"} width={"80px"} height={"90%"}  />
</div>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword
