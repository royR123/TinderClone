import { useCallback, useEffect, useState } from 'react';
import { useLocation , useNavigate } from 'react-router';
import { usePeer } from '../context/Peer';
import { useSocket } from '../context/Socket';
// import { useCallPeers } from '../context/CallPeers'
import axios from '../utils/axios';
import './VideoCall.css'

const VideoCall = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [user,setUser] = useState(null);
    const [calledUser,setCalledUser] = useState(null);
    const userId = location.pathname.split('/')[2];
    const calledUserId = location.pathname.split('/')[3];
    // const { setReceiverId , setThisUserId} = useCallPeers();
    // setReceiverId(calledUserId);
    // setThisUserId(userId);

    const getDetails = async () => {
        try {
            const response = await axios.get('/user',{});
            setUser(() => response.data);
        } catch (error) {
            
        }
    }

    const { socket } = useSocket();
    console.log(socket);



    const tmpArray = [userId,calledUserId];
    tmpArray.sort((a,b) => {
        if(a > b){
            return 1;
        }else if(a < b){
            return -1;
        }else{
            return 0;
        }
    })
    const { peer , createOffer , setRemoteAnswer} = usePeer();
    console.log(peer);
    const handleNewUserJoined = useCallback(() =>
        async ({ userId }) => {
                console.log("ok i get the acknowledgement");
                // const { userName , userId } = data;
                console.log("new user joined room" , userId);
                const offer = await createOffer();
                console.log(offer);
                socket.emit('call-user',{userId , calledUserId , offer });
            } 
            ,[]
    ) 
    const handleAcceptedCall = async ({ answer , receiverUserId }) => {
        console.log("call accepted and the answer is " , answer);
        await setRemoteAnswer(answer);
        navigate(`/room/${roomId}`);

    }
        

    const roomId = tmpArray[0] + tmpArray[1];

    socket.emit('join-room',{ roomId , userId , userName : "Riit"})
    socket.on('joined-room',async ()=>{
        console.log("ok i get the acknowledgement");
    })
    socket.on('user-joined' , async ({ thisUserId }) => {
        if(thisUserId !== userId)return ;
        console.log("ok i get the acknowledgement");
        // const { userName , userId } = data;
        console.log("new user joined room" , userId);
        const offer = await createOffer();
        console.log(offer);
        socket.emit('call-user',{userId , calledUserId , offer });
    } )
    socket.on('call-accepted' ,async ({ answer , receiverUserId }) => {
        console.log("call accepted and the answer is " , answer);
        await setRemoteAnswer(answer);
        navigate(`/room/${roomId}`);

    } )
    
    return (
        <div className="videoCall">
            {`${userId} calling ${calledUserId}`}
        </div>
    );
}
export default VideoCall;