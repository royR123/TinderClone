import './Chat.css'
import LoadingComponent from './LoadingComponent'
import { useRef , useEffect } from 'react';
const Chat = ({ sortedMessages, clickedUser, isLoading , userMessages , clickedUserMessages}) => {
    const lastMessageRef = useRef(null);
    useEffect(() => {
        lastMessageRef.current.scrollIntoView({behavior : 'smooth'});
    },[userMessages , clickedUserMessages])
    return (
        <div>
            {/* {isLoading && LoadingComponent} */}

            {/* {!isLoading &&  */}
            <div className="chat">

                {sortedMessages.map(
                    (message, index) => 
                        (message.name === clickedUser?.first_name) ? (
                            <div className="message-chat" key={index} >
                                <div className="receiver-name" >{message.name}</div>
                                <div className="message-by-receiver" >
                                    <p className="message">{message.text}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="message-chat" key={index} >
                                <div className="sender-name" >you</div>
                                <div className="message-by-sender" >
                                    <div className="message">{message.text}</div>
                                </div>
                            </div>
                        )
                )}
                <div ref={lastMessageRef} />
            </div>
            {/* } */}


        </div>
    );
}
export default Chat;