import React, { useEffect } from 'react'
import './EditProfile.css'
import Button from '../../component/button/Button'
import { useGetUserChannelProfileQuery, useUpdateUserAvatarMutation, useUpdateUserCoverImageMutation } from '../../services/user/userApi'
import { useState } from 'react'
import { Link,useLocation,useParams } from 'react-router-dom'
import ChangeProfile from '../../component/editprofile/ChangeProfile'
import ChangePassword from '../../component/editprofile/ChangePassword'


function EditProfile() {

const {username} = useParams();


const [switchState,setSwitchState] = useState('change profile');

const {data,error,refetch} = useGetUserChannelProfileQuery(username);
const channel = data?.data;

const [updateAvatar,{isLoading:avatarLoading}] = useUpdateUserAvatarMutation();
const [updateCoverImage,{isLoading:coverLoading}] = useUpdateUserCoverImageMutation();


const handleAvatar = async (e)=>{
try {
    const file = e.target.files[0];
    if(!file) return;

    const formdata = new FormData();

    formdata.append("avatar",file);

    await updateAvatar(formdata).unwrap();
    alert("Avatar Updated Successfully")
    refetch();
    window.location.reload();

} catch (error) {
    alert(`Avatar Update Failed,${error}`)
}
}

const handleCoverImage = async (e)=>{
try {
    const file = e.target.files[0];
    if(!file) return;

    const formdata = new FormData();

    formdata.append("coverImage",file);

    await updateCoverImage(formdata).unwrap();
    alert("Cover Image Updated Successfully")
    refetch();



} catch (error) {
    alert(`Cover Image Update Failed,${error}`)
}
}


    return (
        <div className="maineditprofile">
            <div className="editupperinfos">
                {/* coverimage  */}
                <div className="editcoverimagecont">
                   <label id='coverimagelabel' htmlFor="inputcoverimage">
                        <input
                        id='inputcoverimage'
                        type="file"
                        name='coverImage'
                        onChange={handleCoverImage}
                        />
                        {coverLoading? <i class="fa-solid fa-spinner"></i> : <i class="fa-solid fa-cloud-arrow-up"></i>}
                      </label>
                </div>

{/* infoandavatar */}
                <div className="editchannelinfocont">
                    <div className="editavatarchannel">
                      <label id='avatarlabel' htmlFor="avatarinput">
                        <input
                        id='avatarinput'
                        type="file"
                        name='avatar'
                        onChange={handleAvatar}
                        />
                        {avatarLoading? <i class="fa-solid fa-spinner"></i> : <i class="fa-solid fa-cloud-arrow-up"></i>}
                      </label>
                    </div>
                    

                    {/* channeldetail */}
                    <div className="editchanneldatas">
                        <div className="editmetadata">
                            <h3>{channel?.fullName}</h3>
                            <p>@{channel?.username}</p>
                            
                        </div>

                        {/* editbutton */}
                        <div className="viewchannel">
                            <Link to={`/mychannel/${channel?.username}`}>
                            <Button width={"150px"} text={"View channel"} backgroundColor={"red"} color={"white"} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

                {/* buttonstochangeui */}

            <div className="editcomponenttags">
            
                <Button
                onClick={()=>setSwitchState('change profile')}
                text={"Change profile"}
                backgroundColor={switchState === 'change profile'? "red" : "transparent"}
                color={switchState === 'change profile'? "white" : "black"}
                borderBottom={switchState === 'change profile'? "3px solid black" : "none"}
                />
                <Button
                onClick={()=>setSwitchState('change password')}
                text={"Change password"}
                backgroundColor={switchState === 'change password'? "red" : "transparent"}
                color={switchState === 'change password'? "white" : "black"}
                borderBottom={switchState === 'subscribed'? "3px solid black" : "none"}
                />

            </div>

            {/* changingUI */}

            <div className="editcompschannel">
                {
                    switchState === 'change profile' &&
                    <ChangeProfile refetchUser={refetch} />
                }
                {
                    switchState === 'change password' &&
                    <ChangePassword refetchuser={refetch} />
                }
                
            </div>
        </div>
    )
}

export default EditProfile
