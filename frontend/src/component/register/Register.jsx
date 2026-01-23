import toast from "react-hot-toast";
import { useLoginUserMutation, useRegisterUserMutation } from "../../services/user/userApi";
import { useForm } from "react-hook-form";
import './Register.css'
import Logo from "../logo/Logo";
import Input from "../input/Input";
import Button from "../button/Button";
import { Link, useNavigate } from "react-router-dom";

function Register(){

    const navigate = useNavigate();
    const [registerUser,{isLoading:regloading}] = useRegisterUserMutation();
    const {register,handleSubmit,formState:{errors}} = useForm();

    const reg = async (data)=>{

        const formdata = new FormData();
        formdata.append("username",data.username);
        formdata.append("email",data.email);
        formdata.append("fullName",data.fullName);
        formdata.append("avatar",data.avatar[0]);
        formdata.append("coverImage",data.coverImage[0]);
        formdata.append("password",data.password);


       try {
         await registerUser(formdata).unwrap();
         navigate("/login")
         toast.success("Registraition Done")
         
       } catch (error) {
        toast.error(error.data)
        console.log(error)
       }

    }


    return (
        <>
<div className="regcont">

    <div className="regmain">
<div className="reglogo">
    <Logo />
</div>
<div className="reginfo">
     <form className="regform" onSubmit={handleSubmit(reg)}>
 
                <label htmlFor="fullname">Full Name</label>
             <input type={"text"}  placeholder="fullName"
            {...register("fullName",{
                // required:"fullName is requered"
            })}
            />

            {errors.fullName && (
                <p style={{color:"red"}} >*{errors.fullName.message}</p>
            )}

            <label htmlFor="username">Username</label>
            <input type={"text"}  placeholder="username"
            {...register("username",{
                // required:"Username is requered"
            })}
            />

             {errors.username && (
                <p style={{color:"red"}} >*{errors.username.message}</p>
            )}

            <label htmlFor="email">Email</label>
             <input type={"email"}  placeholder="email"
            {...register("email",{
                // required:"email is requered"
            })}
            />

             {errors.email && (
                <p style={{color:"red"}} >*{errors.email.message}</p>
            )}

            <label htmlFor="avatar">Avatar</label>
             <input type={"file"}  placeholder="avatar"
            {...register("avatar",{
                required:"avatar is requered"
            })}
            />

             {errors.avatar && (
                <p style={{color:"red"}} >*{errors.avatar.message}</p>
            )}

            <label htmlFor="coverImage">Cover Image</label>
            <input type={"file"}  placeholder="coverImage"
            {...register("coverImage",{
                required:"coverImage is requered"
            })}
            />

            {errors.coverImage && (
                <p style={{color:"red"}} >*{errors.coverImage.message}</p>
            )}

            <label htmlFor="password">Password</label>
            <input type={"password"}  placeholder="password"
            {...register("password",{
                // required:"Password is requered"
            })}
            />

             


            <Button type="submit"  text={regloading?"Signing Up...":"Sign Up"} backgroundColor={"red"} color={regloading ? "gray" : "white"} width={"100%"} />
            <p>Already have an account&nbsp;<Link to={'/login'}>Sign In</Link></p>
       </form>
</div>
    </div>
</div>

      
        </>
    )

}
export default Register;