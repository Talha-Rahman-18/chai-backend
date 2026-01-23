import React, { useState } from 'react'
import './ChangeProfile.css'
import { useUpdateAccountDetailsMutation } from '../../services/user/userApi'
import Button from '../button/Button';
import toast from 'react-hot-toast'



function ChangeProfile({refetchUser}) {

const [form,setform] = useState({
    fullName:"",
    email:""
})

const [updateProfile]  = useUpdateAccountDetailsMutation();

const onchange= (e)=>{
    const {name,value} = e.target;

    setform(prev=>({
        ...prev,
        [name]:value
    }));


};


const handlEdit =async (e)=>{

// if(!form.fullName || !form.email){
//     toast.error("All field should be fulfilled")
// }

    try {
    e.preventDefault();
    await updateProfile(form).unwrap();

    toast.success("Successfully Changed Profile Information")

    setform({
        fullName:"",
        email:""
    })
    refetchUser();

} catch (error) {
    toast.error(error.data)
    console.log(`Error in Update Profile,${error}`)
}
}


    return (
        <div className="changemain">
            <div className="text">
                <h3>Personal Information</h3>
                <p style={{width:"100%",textAlign:"center"}}>Update Your Pictures and Account Information</p>
            </div>

            <div className="changeform">
                <form id='infoform' onSubmit={handlEdit}>
                <div className="infoform">

                <label htmlFor='fullName'>FullName*</label>
                <input 
                type='text'
                name='fullName'
                value={form.fullName}
                onChange={onchange}
                placeholder='Enter Full Name'
                />

            <label htmlFor='email'>Email Adress*</label>
                <input 
                type='email'
                name='email'
                value={form.email}
                onChange={onchange}
                placeholder='Enter a Valid Email'
                />

                </div>
                

<div className="buttonsave">
    <Button type='submit' text={"save"} color={"white"} backgroundColor={"red"} width={"100px"} />
</div>
                </form>
            </div>
        </div>
    )
}

export default ChangeProfile
