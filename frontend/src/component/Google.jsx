import React from "react";
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useGoogleLoginMutation } from "../services/user/userApi";
import { useNavigate } from "react-router-dom";


const CLIENT_ID =import.meta.env.VITE_GOOGLE_CLIENT_ID ;

function Google() {

const [loginGoogle] = useGoogleLoginMutation();
const navigate = useNavigate();

  const handleLoginSuccess = async(credentialResponse) => {
    const tokenId = credentialResponse?.credential; // <-- THIS IS THE TOKEN ID

if(!tokenId){
  toast.error("token not generated")
}

try {
  
const res =await loginGoogle({tokenId}).unwrap();

if(res?.data?.accessToken && res?.data?.refreshToken){

localStorage.setItem("token",res?.data?.accessToken)

toast.success("google login successfull")

}

navigate("/")


} catch (error) {
toast.error(error?.data?.message || "Google login failed");
  console.log(error)
}
    

  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div>
        
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.log("Login Failed")}
        
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default Google;