import './TweetCard.css'
import { memo } from 'react'
import {useToggleTweetLikeMutation} from '../../services/like/likeApi.js'
import {useCreateTweetMutation,useGetUserTweetQuery,
useUpdateTweetMutation,useDeleteTweetMutation} from '../../services/tweet/tweetApi.js'
import { formateTimeAgo } from '../../utils/formateTimeAgo.js'
import toast from 'react-hot-toast'
import Button from '../button/Button.jsx'

const TweetCard = memo(({data,addTweet=false})=>{



const {data:tweetData,refetch}= useGetUserTweetQuery(data,{skip:!data});

const Usertweets = tweetData?.data[0]?.tweets || [];
const channel = tweetData?.data[0] || [];

const [createTweet] = useCreateTweetMutation();
const [toggleTweetLike] = useToggleTweetLikeMutation();
const [deleteTweet] = useDeleteTweetMutation();

const handleLike= async(tweetId)=>{
    try {

        await toggleTweetLike(tweetId).unwrap();
        refetch();

    } catch (error) {

toast.error('Failed to toggle like:');
console.log(error)
    }
};

// tweetcreation
const handleTweetSubmit = async (e)=>{
e.preventDefault();

try {
    await createTweet({content:e.target[0].value});
    
    e.target[0].value="";
    
    refetch();

    toast.success("Tweet Created")
} catch (error) {
    toast.error("Error in posting tweet")
}

};

// delete 
const handleDelete = async(tweetId)=>{
    try {
        await deleteTweet(tweetId).unwrap();
        toast.success("Tweet Deleted!");
        refetch();
        
    } catch (error) {
      toast.error('Failed to delete tweet!') ; 
    }
};


return (
    <>
    <div className="maintweet">
    {addTweet && (

        <form onSubmit={handleTweetSubmit}>
        <div className="addtweet">
            <textarea style={{backgroundColor:"transparent"}} name="tweet" id="tweet" placeholder='Tweet Here'></textarea>
            <Button className="tweetbtn" text={"Send"} />
           
        </div>
        </form>
        
    )}


{Usertweets && Usertweets.length>0?(

[...Usertweets].reverse().map((tweet,idx)=>(

     <div key={tweet._id || idx} className="tweetcont">

            <div className="tweetimg">

            <img className="tweet" src={channel.avatar} alt={channel.username} />
           
            </div>

            <div className="tweetcontent">

                <h4>{channel.fullName} &nbsp;.&nbsp;{formateTimeAgo(tweet.createdAt)} </h4> 
                <p>{tweet.content}</p>
                <Button
                text={<i class="fa-regular fa-thumbs-up"></i>}
                height={"4vh"}
                width={"2vw"}
                backgroundColor={"whitesmoke"}
                onClick={(e)=>{
                    e.preventDefault();
                    handleLike(tweet._id);

                }} /> 

                <span>{tweet.likesCount? tweet.likesCount.count : 0}&nbsp;Like</span>
            </div>

            <Button
            height={"40px"}
            backgroundColor={"red"}
            color={"white"}
            text={<i class="fa-solid fa-trash"></i>}
            onClick={(e)=>{
                e.preventDefault();
                handleDelete(tweet._id)
            }} />

        </div>
))

):(<div><h2 style={{textAlign:"center",color:"black"}}>No tweet for this channel!</h2></div>)}



</div>
</>
    
)










})


export default TweetCard;