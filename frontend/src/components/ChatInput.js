import { useState } from "react";
import axios from '../utils/axios';
import './ChatInput.css';
import { useCookies } from "react-cookie";
const ChatInput = ({ user , clickedUser , getUserMessages , getClickedUserMessages }) => {
    const [textarea,setTextArea] = useState('');
    const [cookies] = useCookies();
    const handleSubmit = async () => {
        const message = {
            timeStamp : new Date().toISOString(),
            from_user_id : user?.user_id,
            to_user_id : clickedUser?.user_id,
            message : textarea
        };
        try {
            await axios.post('/messages',{ message },{
                headers:{
                    "Authorisation" : `Bearer ${cookies.token}`
                }
            })
            getUserMessages();
            getClickedUserMessages();
            setTextArea(() => '')
        } catch (e) {
            console.log(e);
        }
    }
    return (
    <div>
        <input 
            className="text-area" 
            value={textarea}
            placeholder = "type here..."
            onChange={(e) => {setTextArea(e.target.value);}}
        />
        <button className="send-btn" onClick={handleSubmit}>SEND</button> 
    </div>
    );
}
export default ChatInput;