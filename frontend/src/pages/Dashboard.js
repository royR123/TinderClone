import ChatContainer from "../components/ChatContainer";
import TinderCard from 'react-tinder-card';
import { useState , useEffect , useRef } from "react";
import { useCookies } from "react-cookie";
import axios from "../utils/axios";
import './Dashboard.css';
import { useNavigate } from 'react-router'
import { useSocket } from "../context/Socket";
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CancelIcon from '@mui/icons-material/Cancel';
const Dashboard = ({ isLoading , setIsLoading}) => {
    // console.log("in dashboard");
    const { socket } = useSocket();
    const navigate = useNavigate();
    const [roomId , setRoomId] = useState(null);
    const [lastDirecton,setLastDirection] = useState();
    const [matchedUserIds,setMatchedUserIds] = useState([]);
    const [genderedUsers,setGenderedUsers] = useState([]);
    const [notificationIncomingCall,setNotificationIncomingCall] = useState(false);
    const [caller , setCaller] = useState(null);
    const [user,setUser] = useState({
        user_id : "",
        first_name: "",
        dob_day: "",
        dob_month: "",
        dob_year: "",
        show_gender: false,
        gender_identity: "",
        gender_interest: "",
        url: "",
        about: "",
        matches: []
    });
    const [cookies , setCookie , removeCookie] = useCookies(['user']);
    // console.log(user);
    const userId = cookies.userId;
    socket.emit('register-me' , ({ userId }))
    const isCalled = useRef(false);
    const getUser = async () => {
        
        if(isCalled.current === false){
            const response = await axios.get('/user',{
                params : {userId},
                headers:{
                    "authorisation" : `Bearer ${cookies.Token}`
                }
            });
            
            
            setUser((prev) => ({...prev,
                user_id : response.data.user_id,
                first_name: response.data.first_name,
                dob_day: response.data.dob_day,
                dob_month: response.data.dob_month,
                dob_year: response.data.dob_year,
                show_gender: response.data.show_gender,
                gender_identity: response.data.gender_identity,
                gender_interest: response.data.gender_interest,
                url: response.data.url,
                about: response.data.about ,
                matches: response.data.matches
            }))
        }
    }
    const calledMatches = useRef(false);
    const updateMatches = async (matchedUserId) => {
        try {
            // console.log(calledMatches);
            if(calledMatches.current === true){
                const response = await axios.put('/updateUser/matches',{ matchedUserId , userId : user.user_id },{
                    params:{
                        userId : cookies.userId,
                    },
                    headers:{
                        "authorisation" : `Bearer ${cookies.Token}`
                    }
                    
                });
                console.log(response.data);
            }
        } catch (error) {
            console.log("error in client");
        }
    }
    const getGenderedUsers = async () => {
        try{
            const response = await axios.get('/genderedusers',{
                params : {gender : user.gender_interest,userId : user.user_id},
                headers:{
                    "Authorisation" : `Bearer ${cookies.token}`
                }
            })
            setGenderedUsers(response.data);
            // console.log()
            // console.log(response.data);
        }catch(error){
            console.log(error);
        }
    }
    
    useEffect(() =>{
        // console.log("in useEffect");
        getUser();
        isCalled.current = true;
    },[])
    useEffect(() => {
        getGenderedUsers();
        calledMatches.current = true;
        setMatchedUserIds((prev)=>([...prev,...user.matches]))
    },[user]);
    const handleCallFromUser = async ({ roomId , callerId , callToUserId }) => {
        console.log('someone calling...')
        const response = await axios.get('/user',{
            params:{
                userId : callerId
            }
        })
        setCaller(() => response.data);
        console.log(response.data);
        // socket.emit('')
        setNotificationIncomingCall(true);
        setRoomId(roomId)

    }
    useEffect(() => {
        socket.on('call-from-user' , handleCallFromUser);
        return () => {
            socket.off('call-from-user' , handleCallFromUser);
        }
    },[socket]);
    
    // console.log(genderedUsers);
    
    const swiped = (direction,matchedUser) => {
        if(direction === 'right'){
            updateMatches(matchedUser.user_id);
        }
        console.log("removing " + matchedUser.first_name );
        setLastDirection(direction)
    }
    
    const outOfFrame = (user) => {
        console.log(user.first_name + ' left the screen!')
    }
    // console.log(user);
    
    console.log(matchedUserIds);
    console.log(user.matches);
    
    const handleAccept = () => {
        setNotificationIncomingCall(false);
        setCaller(null);
        navigate(`/room/${roomId}`);
    }
    const handleReject = () => {
        setNotificationIncomingCall(false);
        setCaller(null);       
    }
    
    const filteredGenderedUsers = genderedUsers?.filter(
        genderedUser => !matchedUserIds.includes(genderedUser.user_id));
    return (
        
        <div className="dashboard">
            <ChatContainer user = {user} isLoading = {isLoading} setIsLoading = {setIsLoading} />
            <div className="swiper-container">
                <div className="card-container">

                    {filteredGenderedUsers.map((character) => 
                        <TinderCard className="swipe" 
                            key = {character.user_id} 
                            onSwipe = {(dir) => swiped(dir,character)}
                            onCardLeftScreen = {() => outOfFrame(character)}
                        > 
                            <div style= {{backgroundImage : "url(" + character.url + "}"}}
                            className = "card">
                                <h3>{character.first_name}</h3>
                            </div>
                        </TinderCard>
                    )}
                    <div className="swipe-info" >
                        {lastDirecton ? <p>{`you swiped ${lastDirecton}`}</p> : <p/>}
                    </div>
                </div>
                {
                    notificationIncomingCall &&
                    <div className="someone-call" >
                        <div id ="wrapper2"> 
                            <img src={caller?.url} className = 'image' />
                            <div id="caller-name" >{caller?.first_name}</div>
                        </div>
                        <div id="wrapper1" > 
                            <button onClick={handleAccept} id= 'accept-btn' > <VideoCallIcon /> </button>
                            <button onClick={handleReject} id= 'reject-btn' > <CancelIcon /> </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default Dashboard;