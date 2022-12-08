import Chat from "./Chat";
import ChatInput from "./ChatInput";
import './ChatDisplay.css'
import { useState , useEffect } from "react";
import axios from '../utils/axios';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { useSocket } from "../context/Socket";
const ChatDisplay = ({ user , clickedUser ,setClickedUser , setIsLoading ,isLoading }) => {
    const navigate = useNavigate();
    const { socket } = useSocket();
    const handleClick = () => {
        setClickedUser(null)
    }
    const [cookies] = useCookies();
    const [userMessages , setUserMessages] = useState(null);
    const [clickedUserMessages , setClickedUserMessages] = useState(null);
    // const [sortedMessages,setSortedMessages] = useState([]);
    const getUserMessages = async () => {
        setIsLoading(() => true);
        try{
            const response = await axios.get('/messages',{
                params : {from_user_id : user?.user_id  , to_user_id : clickedUser?.user_id},
                headers:{
                    "Authorisation" : `Bearer ${cookies.token}`
                }
            })
            setUserMessages(response.data);
        }catch(e){
            console.log(e);
        }
        setIsLoading(() => false)
    }
    const getClickedUserMessages = async () => {
        try{
            const response = await axios.get('/messages',{
                params : {from_user_id : clickedUser?.user_id , to_user_id : user?.user_id },
                headers:{
                    "Authorisation" : `Bearer ${cookies.token}`
                }
            })
            setClickedUserMessages(response.data);
        }catch(e){
            console.log(e);
        }
    }

    useEffect(() => {
        getUserMessages();
        getClickedUserMessages();
    },[])
    const messages = [];
    userMessages?.forEach(message => {
        messages.push({
            name : user?.first_name,
            text : message.message,
            timeStamp : message.timeStamp
        })
    })
    clickedUserMessages?.forEach(message => {
        messages.push({
            name : clickedUser?.first_name,
            text : message.message,
            timeStamp : message.timeStamp
        })
    })
    const handleVideoCall = () => {
        const tmpArray = [user?.user_id,clickedUser?.user_id];
        tmpArray.sort((a,b) => {
            if(a > b){
                return 1;
            }else if(a < b){
                return -1;
            }else{
                return 0;
            }
        })
        const roomId = tmpArray[0] + tmpArray[1];
        socket.emit('calling' , {roomId , callerId : user?.user_id , callToUserId : clickedUser?.user_id})
        navigate(`/room/${roomId}`);
    }
    const sortedMessages =  messages?.sort((a,b) => a.timeStamp.localeCompare(b.timeStamp));
    return (
        <div> 
            <button id = 'leave-btn' onClick={handleClick}>Go To Matches</button>
            <div className="videocall-btn" onClick={handleVideoCall} >
                video call
            </div>            
            <Chat sortedMessages ={sortedMessages} clickedUser = {clickedUser} setIsLoading = {setIsLoading} isLoading = {isLoading} userMessages = {userMessages} clickedUserMessages = {clickedUserMessages} />
            
            <ChatInput 
            user = {user} 
            clickedUser = {clickedUser} 
            getUserMessages = {getUserMessages}
            getClickedUserMessages = {getClickedUserMessages}
            />
        </div>
    )
}
export default ChatDisplay;