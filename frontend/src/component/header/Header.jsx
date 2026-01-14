import React from 'react'
import { useEffect } from 'react'
import './Header.css'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../button/Button'
import {useGetCurrentUserQuery, useLogoutUserMutation} from '../../services/user/userApi'
import Logo from '../logo/Logo'
import toast from 'react-hot-toast'
import { api } from '../../services/api'

function Header() {

    const navigate = useNavigate();

const token = localStorage.getItem('token');

const {data,error,isLoading,refetch} =useGetCurrentUserQuery();
const user = data?.data;

const auth = !!user || !!localStorage.getItem('token');

const [logout] = useLogoutUserMutation();

useEffect(() => {
    if (localStorage.getItem('token') && !user) {
      refetch();
    }
  }, [refetch, user, auth]);

const handleLogout = async()=>{
    try {
        await logout().unwrap();
        localStorage.removeItem('token');
        alert("Logout successfull");
        window.location.reload();
        navigate("/")
        
    } catch (error) {
        alert(`logout error ${error}`)
        localStorage.removeItem('token');
    } finally {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  }
}


    return (
       <div className="headercont">
        <div className="logohead">
            <div id="logoapp">
               <Logo />
            </div>
        </div>
        

        

{!auth? (
    <div className="elementheader">
        <Button height={"40px"} width={"120px"} text={"Login"} color={"white"} backgroundColor={"red"} onClick={()=>navigate("/login")} />

        <Button height={"40px"} width={"120px"} text={"Register"} color={"white"} backgroundColor={"red"} onClick={()=>navigate("/register")} />
    </div>
):(<div className="elementheader">
            <Button fontSize={"1.2rem"} height={"45px"} width={"45px"} text={<i class="fa-solid fa-arrow-rotate-right"></i>} backgroundColor={"red"} color={"white"}  />
            <div className="channellink">
                <Link to={`/mychannel/${user?.username}`}>
                <img src={user?.avatar} alt={user?.username} />
                </Link>
            </div>
            <Button  height={"40px"} width={"120px"} text={<i class="fa-solid fa-power-off"></i>} color={"white"} backgroundColor={"red"} onClick={handleLogout} />
        </div>)}


       </div>
    )
}

export default Header
