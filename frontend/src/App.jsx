import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Input from './component/input/Input'
import Commentcard from './component/commentcard/Commentcard'
import Button from './component/button/Button'
import Postcard from './component/postcard/postcard'
import TweetCard from './component/tweet/TweetCard' 
import SubscriptionCard from './component/subscribe/SubscribeCard'
import Login from './component/login/Login'
import Register from './component/register/Register'
import VideoCard from './component/video/VideoCard'
import { Outlet } from 'react-router'
import Scrolltop from './component/Scrolltop'
import './App.css'
import PlaylistCard from './component/playlist/PlaylistCard'
import Player from './pages/player/Player'
import Header from './component/header/Header'
import AddPlaylist from './component/playlist/AddPlaylist'
import Sidebar from './component/sidebar/Sidebar'
import { useGetCurrentUserQuery, useRefreshAccessTokenMutation } from './services/user/userApi'

function App() {

  

return (
   
<div className="appcont">

<header className="header">
<Header />
</header>
<Sidebar />
<Scrolltop />

<main className="outlet">
<Outlet />
</main>

</div>
  )
}

export default App
