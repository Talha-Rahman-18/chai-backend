import { useState } from 'react';
import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import Input from '../input/Input';
import Button from '../button/Button';
import TweetCard from '../tweet/TweetCard';
import { useGetCurrentUserQuery, useLoginUserMutation } from '../../services/user/userApi';
import './Login.css'
import Logo from '../logo/Logo';

function Login (){
    const { register, handleSubmit,formState:{errors} } = useForm();
    const [loginUser] = useLoginUserMutation();
    const navigate = useNavigate();
    
    const login= async(data)=>{

try {
    const res= await loginUser(data).unwrap();
    if(res?.data?.accessToken && res?.data?.refreshToken){
        localStorage.setItem('token',res.data.accessToken);
    }
navigate("/");    
} catch (error) {
    alert(error.data)
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
            <Input
            label={"Username"}
            type={"text"}
            placeholder={"Enter valid Username"}
            {...register("username",{
                required:"username required"
                 
            })}
            />
            {errors.username && (
                <p style={{color:"red"}}>{errors.username.message}</p>
            )}
{/* email */}
            {/* <Input
            
            label={"Email"}
            type={"email"}
            placeholder={"Enter valid Email"}
            {...register("email",{
                required:"email needed"
                 
            })}
            />
            {errors.email && (
                <p style={{color:"red"}}>{errors.email.message}</p>
            )} */}
{/* password */}
            <Input
           
            label={"Password"}
            type={"password"}
            placeholder={"Enter password"}
            {...register("password",{
                required:true,
            })}
            />
            {errors.password && (
                <p style={{color:"red"}}>{errors.password.message}</p>
            )}

{/* button  */}
<Button type='submit' color={"white"} backgroundColor={"red"} width={"85%"} text={"Login"} alignSelf={"center"}/>

{/* <Button color={"white"} backgroundColor={"red"} width={"85%"} text={"Login as Demo"} alignSelf={"center"}/> */}


<p>Dont have an account?&nbsp;SignUp</p>
</form>
</div>

        </div>
       </div>
       
    )







}

export default Login;