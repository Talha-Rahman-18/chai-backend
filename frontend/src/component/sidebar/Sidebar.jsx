import React from 'react'
import './Sidebar.css'
import { useGetCurrentUserQuery } from '../../services/user/userApi'
import { useGetLikedVideosQuery } from '../../services/like/likeApi'
import { Link } from 'react-router-dom'

function Sidebar() {
    
const {data} = useGetCurrentUserQuery();
const name = data?.data?.username;

    return (
        <div className="sidebarmain">
            <div className="slide1">
<Link to={'/'} className='slidelink'>
<div className="slides">👍<div className="links">Home</div></div>
</Link>

<Link to={'/mychannel-likedvideos'} className='slidelink'>
<div className="slides">👍<div className="links">Liked Videos</div></div>
</Link>

<Link to={'/mychannel-history'} className='slidelink'>
<div className="slides">👍<div className="links">History</div></div>
</Link>

<Link to={`/mychannel/${name}`} className='slidelink'>
<div className="slides">👍<div className="links">My Content</div></div>
</Link>

<Link to={`/mychannel/${name}`} state={{switchState:"Playlists"}} className='slidelink'>
<div className="slides">👍<div className="links">Collections</div></div>
</Link>

<Link to={`/mychannel/${name}`} state={{switchState:"subscribed"}} className='slidelink'>
<div className="slides">👍<div className="links">Subscriptions</div></div>
</Link>


            </div>




            <div className="slide2">
<Link to={'/support'} className='slidelink'>
<div className="slides">👍<div className="links">Support</div></div>
</Link>

<Link to={'/mydashboard'} className='slidelink'>
<div className="slides">👍<div className="links">Setting</div></div>
</Link>


            </div>

        </div>
    )
}

export default Sidebar
