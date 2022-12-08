import ChatHeader from "./ChatHeader";
import ChatDisplay from "./ChatDisplay";
import MatchesDisplay from "./MatchesDisplay";
import './ChatContainer.css';
import { useState } from "react";
const ChatContainer = ({user , isLoading , setIsLoading }) => {

    const [clickedUser,setClickedUser] = useState(null);

    return (
        <div className="chat-container">
            <ChatHeader user = {user}/>
            
            {!clickedUser && <MatchesDisplay matches = {user.matches} setClickedUser = {setClickedUser} isLoading = {isLoading} setIsLoading = {setIsLoading} />}
            {clickedUser && <ChatDisplay user = {user} clickedUser = {clickedUser} setClickedUser = {setClickedUser} isLoading = {isLoading} setIsLoading = {setIsLoading} />}
        </div>
    );
}
export default ChatContainer;