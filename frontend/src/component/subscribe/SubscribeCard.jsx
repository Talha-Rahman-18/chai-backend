import { Link } from 'react-router-dom';
import {useToggleSubscriptionMutation,useGetSubscribedChannelsQuery, useGetUserChannelSubscribersQuery} from '../../services/subscription/subscriptionApi.js'
import { useGetCurrentUserQuery } from '../../services/user/userApi.js';
import Button from '../button/Button.jsx';
import './SubscriptionCard.css'

function SubscriptionCard({data}){

// const {data:mys} = useGetUserChannelSubscribersQuery(data,{skip:!data});

// console.log(mys);


const {data:subscribedChannel,refetch,isLoading,isError} = useGetSubscribedChannelsQuery(data,{skip: !data});

const subscribed = subscribedChannel?.data || [];

const {data:current} = useGetCurrentUserQuery();
const name=current?.data?.username;

const [subscribe] = useToggleSubscriptionMutation();

const handlesub=async (id)=>{
    try {
        await subscribe(id).unwrap();
        refetch();
    } catch (error) {
        alert(error);
    }

}



return(
    <>
    <div className="subcont">

{isLoading && (
    <h1>Loading...</h1>
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
                        <h4>Talha</h4> 
                        <p>{subscribe?.subscriberCount
}&nbsp;subscribers</p>
                        
                    </div>
                    <Button 
                    onClick={()=>handlesub(subscribe?._id)}
                    text={"subscribed"} />
                </div>
       ))
        ) : (<h1 >No channel subscribed </h1>)}
        
    </div>
    </>
)

}

export default SubscriptionCard;