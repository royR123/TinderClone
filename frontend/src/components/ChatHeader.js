import './ChatHeader.css'
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
const ChatHeader = ({user}) => {
    
    const navigate = useNavigate();
    const [cookies , setCookie , removeCookie] = useCookies();
    const handleClick = () => {
        removeCookie('userId',cookies.userId);
        removeCookie('Token',cookies.Token);
        removeCookie('Email',cookies.Email);
        navigate('/')
        window.location.reload();
        // if(!cookies.userId)navigate('/');
    }
    return (
        <div className = "chat-header"> 
            <div className="profile"> 
                <div className="img-container">
                    <img src ={user?.url} alt = {user?.first_name} id = "user-img"/>
                </div>
                <h3>{user?.first_name}</h3>

            </div> 
            {/* <LogoutIcon /> */}
            <Button className="log-out" onClick={handleClick} endIcon = {<LogoutIcon color = 'action' />}></Button>
        </div>
    );
}
export default ChatHeader;