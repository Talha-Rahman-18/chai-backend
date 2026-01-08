import './Postcard.css'
import { formateTimeAgo } from '../../utils/formateTimeAgo';
import { formateViews } from '../../utils/formateViews';
import { formateDuration } from '../../utils/formateDuration';
import { Link } from 'react-router-dom';
import { useGetCurrentUserQuery } from '../../services/user/userApi';
function Postcard({
    _id,
    tittle,
    thumbnail,
    duration,
    views,
    createdAt,
    channel:{channelId,username,avatar}={}
}){

 const {data} = useGetCurrentUserQuery();
 const name = data?.data?.username;

   

    return(
        <>
        <div className="contpostcard">
            <div className="thumbnail">
                <Link className='thumbnailink' to={`/player/${_id}`}>
                <img className='thmb' src={thumbnail} 
                alt="thumbnail" />
                <span className='duration'>{formateDuration(duration)}</span>
            </Link>
            </div>
            <div className="infosvideo">
                <div className="chnnl">
                    <Link to={username === name ?`/mychannel/${username}` : `/channel/${username}` }>
                    <img className='chnnlavtr' src={avatar} alt="avatar" />
                    </Link>
                </div>
                <div className="allinfo">
                    <h3 >{tittle}</h3>
                    
                    <p>{formateViews(views)}&nbsp;views&nbsp;·&nbsp;{formateTimeAgo(createdAt)}</p>
                    <p>@{username}</p>

                </div>
            </div>
        </div>
        </>
    )










}

export default Postcard