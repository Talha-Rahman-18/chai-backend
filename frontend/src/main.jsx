import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import store from './app/store.js'
import App from './App.jsx'
import Player from './pages/player/Player.jsx'
import VideoCard from './component/video/VideoCard.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Login from './component/login/Login.jsx'
import Commentcard from './component/commentcard/Commentcard.jsx'
import MyChannel from './pages/mychannel/Channelmy.jsx'
import Channel from './pages/channel/Channel.jsx'
import Home from './pages/Home/Home.jsx'
import Register from './component/register/Register.jsx'
import ProtectedRoute from './component/ProtectedRoute.jsx'
import Sidebar from './component/sidebar/Sidebar.jsx'
import History from './pages/history/History.jsx'
import LikedVideos from './pages/liked videos/LikedVideos.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import Support from './pages/Support.jsx'
import ChangeProfile from './component/editprofile/ChangeProfile.jsx'
import EditProfile from './pages/EditProfile/EditProfile.jsx'
import PlaylistVideos from './pages/playlist/PlaylistVideos.jsx'
import Loading from './component/loading/Loading.jsx'


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
        <Route index element={<Home />} />
        <Route path='/login' element={<Login />} />        
        <Route path='/register' element={<Register />} />
        <Route path='/loading' element={<Loading />} />
<Route element={<ProtectedRoute />} >
        <Route path='/player/:videoId' element={<Player />} />
        <Route path='/videocard' element={<VideoCard />} />
        <Route path='/comment' element={<Commentcard />} />
        <Route path='/mychannel/:username' element={<MyChannel />} />
        <Route path='/mychannel/:username/edit' element={<EditProfile />} />
        <Route path='/channel/:username' element={<Channel />} />
        <Route path='/playlist/:playlistId' element={<PlaylistVideos />} />
        <Route path='/mychannel-history' element={<History />} />
        <Route path='/mychannel-likedvideos' element={<LikedVideos />} />
        <Route path='/mydashboard' element={<Dashboard />} />
        <Route path='/support' element={<Support />} />



        </Route>

        </Route>
    )
)

createRoot(document.getElementById('root')).render(
<Provider store={store}>
    <RouterProvider router={router} />
</Provider>

)
