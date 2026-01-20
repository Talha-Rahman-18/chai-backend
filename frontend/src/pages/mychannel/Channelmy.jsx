import React, { useEffect } from 'react'
import './Channelmy.css'
import coll4 from './coll4.jpg'
import Button from '../../component/button/Button'
import VideoCard from '../../component/video/VideoCard'
import PlaylistCard from '../../component/playlist/PlaylistCard'
import SubscribeCard from '../../component/subscribe/SubscribeCard'
import TweetCard from '../../component/tweet/TweetCard' 
import { useGetCurrentUserQuery, useGetUserChannelProfileQuery } from '../../services/user/userApi'
import { useState } from 'react'
import { Link,useLocation,useParams } from 'react-router-dom'


function Channelmy() {

const {username} = useParams();

const location = useLocation();

const [switchState,setSwitchState] = useState('videos');

const {data,error} = useGetUserChannelProfileQuery(username);
const channel = data?.data;



useEffect(()=>{
if(location.state?.switchState !== undefined){
    setSwitchState(location.state.switchState);
}
},[location.state])



    return (
        <div className="mainchannelcont">
            <div className="upperinfos">
                <div className="coverimagecont">
                    <img src={channel?.coverImage} alt={"coverimage"} />
                </div>
                <div className="channelinfocont">
                    <div className="avatarchannel">
                        <img src={channel?.avatar} alt={"avatar"} />
                    </div>
                    <div className="channeldatas">
                        <div className="metadata">
                            <h3>{channel?.fullName}</h3>
                            <p>@{channel?.username}</p>
                            <p>{channel?.subscribersCount
} subscriber&nbsp;·&nbsp;{channel?.channelsSubscribedToCount}&nbsp;subscribed</p>
                        </div>
                    </div>
                        <div className="editchannel">
                            <Link to={`/mychannel/${channel?.username}/edit`}>
                            <Button width={"15vw"} text={"Edit"} backgroundColor={"red"} />
                            </Link>
                        </div>
                </div>
            </div>
            <div className="componenttags">
                <Button
                onClick={()=>setSwitchState('videos')}
                text={"Videos"}
                backgroundColor={switchState === 'videos'? "red" : "transparent"}
                color={switchState === 'videos'? "white" : "black"}
                borderBottom={switchState === 'videos'? "3px solid black" : "none"}
                />
                <Button
                onClick={()=>setSwitchState('Playlists')}
                text={"Playlists"}
                backgroundColor={switchState === 'Playlists'? "red" : "transparent"}
                color={switchState === 'Playlists'? "white" : "black"}
                borderBottom={switchState === 'Playlists'? "3px solid black" : "none"}
                />
                <Button
                onClick={()=>setSwitchState('tweets')}
                text={"Tweets"}
                backgroundColor={switchState === 'tweets'? "red" : "transparent"}
                color={switchState === 'tweets'? "white" : "black"}
                borderBottom={switchState === 'tweets'? "3px solid black" : "none"}
                />
                <Button
                onClick={()=>setSwitchState('subscribed')}
                text={"Subscribed"}
                backgroundColor={switchState === 'subscribed'? "red" : "transparent"}
                color={switchState === 'subscribed'? "white" : "black"}
                borderBottom={switchState === 'subscribed'? "3px solid black" : "none"}
                />

            </div>
            <div className="compschannel">
                {
                    switchState === 'videos' &&
                    <VideoCard data={channel?._id} addVideoBtn={true} />
                }
                {
                    switchState === 'Playlists' &&
                    <PlaylistCard data={channel?._id} />
                }
                {
                    switchState === 'tweets' &&
                    <TweetCard data={channel?._id} addTweet={true} />
                }
                {
                    switchState === 'subscribed' &&
                    <SubscribeCard data={channel?._id}/>
                }
            </div>
        </div>
    )
}

export default Channelmy
