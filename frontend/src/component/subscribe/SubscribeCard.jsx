import { Link } from 'react-router-dom';
import {useToggleSubscriptionMutation,useGetSubscribedChannelsQuery, useGetUserChannelSubscribersQuery} from '../../services/subscription/subscriptionApi.js'
import { useGetCurrentUserQuery } from '../../services/user/userApi.js';
import Button from '../button/Button.jsx';
import './SubscriptionCard.css'
import toast from 'react-hot-toast'

function SubscriptionCard({data}){


const {data:subscribedChannel,refetch,isLoading,isError} = useGetSubscribedChannelsQuery(data,{skip: !data});

const subscribed = subscribedChannel?.data || [];

const {data:current} = useGetCurrentUserQuery();
const name=current?.data?.username;

const [subscribe] = useToggleSubscriptionMutation();




return(
    <>
    <div className="subcont">

{isLoading && (
    <h2>Loading...</h2>
)}


        {!isError && !isLoading && subscribed && subscribed.length > 0? (
            subscribed.map((subscribe,idx)=>(

        <div key={subscribe?._id || idx } className="subscribecont">
                        <Link to={subscribe?.username === name ?  `/mychannel/${subscribe?.username}` :  `/channel/${subscribe?.username}` } >
                    <div className="subimg">
                    <img className="sub" src={subscribe?.avatar} alt={subscribe?.username} />
                    </div>
                    </Link>
                    <div className="subcontent">
                        <h4>{subscribe?.fullName}</h4> 
                        <p>{subscribe?.subscriberCount
}&nbsp;subscribers</p>
                        
                    </div>
                    
                </div>
       ))
        ) : (<h2 style={{textAlign:"center"}} >No channel subscribed </h2>)}
        
    </div>
    </>
)

}

export default SubscriptionCard;