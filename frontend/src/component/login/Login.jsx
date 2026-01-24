import { useState } from 'react';
import {useForm} from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../input/Input';
import Button from '../button/Button';
import TweetCard from '../tweet/TweetCard';
import { useGetCurrentUserQuery, useLoginUserMutation } from '../../services/user/userApi';
import './Login.css'
import Logo from '../logo/Logo';
import toast from 'react-hot-toast';

function Login (){
    const { register, handleSubmit,formState:{errors} } = useForm();
    const [loginUser,{isLoading:logloading}] = useLoginUserMutation();
    const navigate = useNavigate();
    const [show,setshow] =useState(false);
    
    const login= async(data)=>{

try {
    const res= await loginUser(data).unwrap();
    if(res?.data?.accessToken && res?.data?.refreshToken){
        localStorage.setItem('token',res.data.accessToken);

        toast.success("Login Successfull")
    }
    
    navigate("/");    
    window.location.reload();

} catch (error) {
    toast.error(error.data)
    console.log(error.data);
}

}



const token= localStorage.getItem('token')
  const { data:curr, isLoading, refetch } = useGetCurrentUserQuery(undefined, { skip: !token });
  const userData = curr?.data?._id;



return(

    <div className="contlogin">
        <div className="inpcont">
            <div className="loginlogo">
                <Logo />
            </div>
{/* name */}
<div className="inputform">
            <form onSubmit={handleSubmit(login)} className='forminput'>

                <label htmlFor="username">Username</label>
            <input
            id='username'
            type={"text"}
            placeholder={"Enter valid Username"}
            {...register("username",{
                // required:"username required"
                 
            })}
            />
            
           
{/* password */}

            <label htmlFor='password'>Password</label>
            <input
            id='password'
            type={show? "text" : "password"}
            placeholder={"Enter password"}
            {...register("password",{
                required:"password is required",
            })}
            />
            {errors.password && (
                <p style={{color:"red"}}>{errors.password.message}</p>
            )}


<div style={{display:"flex",alignItems:"center",alignSelf:"flex-start",justifyContent:"center",width:"max-content",gap:"1vw"}}>

           <label class="checkbox">
  <input type="checkbox"
  onChange={()=>setshow(!show)}
  />

  <span class="custom"></span>

  show password
</label>
            </div>

{/* button  */}
<Button type='submit' color={logloading?"gray": "white"} backgroundColor={"red"} width={"100%"} text={logloading? "Signing In...": "Sign In"} alignSelf={"center"}  />



<p>Dont have an account?&nbsp;<Link to={'/register'}>Sign Up</Link></p>
</form>
</div>

        </div>
       </div>
       
    )







}

export default Login;