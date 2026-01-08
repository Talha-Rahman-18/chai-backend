import toast from "react-hot-toast";
import { useLoginUserMutation, useRegisterUserMutation } from "../../services/user/userApi";
import { useForm } from "react-hook-form";
import './Register.css'
import Logo from "../logo/Logo";
import Input from "../input/Input";
import Button from "../button/Button";
import { useNavigate } from "react-router-dom";

function Register(){

    const navigate = useNavigate();
    const [registerUser] = useRegisterUserMutation();
    const {register,handleSubmit} = useForm();

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
         alert("Registraition Done")
         
       } catch (error) {
        alert(`Registration failed: ${error.data?.message || error.message || error}`)
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
                required:"fullName is requered"
            })}
            />

            <label htmlFor="username">Username</label>
            <input type={"text"}  placeholder="username"
            {...register("username",{
                required:"Username is requered"
            })}
            />

            <label htmlFor="email">Email</label>
             <input type={"email"}  placeholder="email"
            {...register("email",{
                required:"email is requered"
            })}
            />
            <label htmlFor="avatar">Avatar</label>
             <input type={"file"}  placeholder="avatar"
            {...register("avatar",{
                required:"avatar is requered"
            })}
            />
            <label htmlFor="avatar">Cover Image</label>
            <input type={"file"}  placeholder="coverImage"
            {...register("coverImage",{
                required:"coverImage is requered"
            })}
            />
            <label htmlFor="password">Password</label>
            <input type={"password"}  placeholder="password"
            {...register("password",{
                required:"Password is requered"
            })}
            />

            <Button type="submit"  text={"Sign Up"} backgroundColor={"skyblue"} color={"white"} width={"50%"} />
       </form>
</div>
    </div>
</div>

      
        </>
    )

}
export default Register;