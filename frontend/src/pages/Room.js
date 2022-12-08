import { useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useSocket } from '../context/Socket';
import { useLocation , useNavigate } from 'react-router';
import { useVideo } from '../context/Video';
import { usePeer } from '../context/Peer';
import MicNoneIcon from '@mui/icons-material/MicNone';
import MicOffIcon from '@mui/icons-material/MicOff';
import './Room.css'
import { useCookies } from 'react-cookie';
const Room = () => {
    const [mute,setMute] = useState(false);
    const navigate = useNavigate();
    const userStream = useRef();
    const partnerStream = useRef();
    const [otherVideo , setOtherVideo] = useState(true);
    const { peer } = usePeer();
    const { socket } = useSocket();
    const otherUser = useRef();
    // const { userStream, partnerStream, setPartnerStream, setUserStream } = useVideo();
    const roomId = useLocation().pathname.split('/')[2];

    const [cookies] = useCookies(['user']);

    useEffect(() => {
        const initCall = async (socket) => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true , audio : true})
            userStream.current = stream;
            // setTimeout(() => {

            // } , 5000);
            console.log(userStream.current);
            console.log('join-room event is called');
            socket.emit('join-room', roomId);
        }
        initCall(socket);

    }, [])
    useEffect(() => {

        socket.on('other-user', userId => {
            console.log('inside other-user event')
            console.log(userId);
            // while(userStream === null);
            callUser(userId);
            otherUser.current = userId;
        })

        socket.on('user-joined', userId => {
            console.log('inside user-joined event');
            otherUser.current = userId;
        })

        socket.on('offer', (incoming) => handleReceiveCall(incoming));

        socket.on('answer', (message) => handleAnswer(message));

        socket.on('ice-candidate', (payload) => handleNewICECandidateMsg(payload));

        socket.on('other-user-end-call' , ({ userId }) => {
            setOtherVideo(false);
            peer.close();
        })
    }, [socket])

    const callUser = (userId) => {
        createPeer(userId);
        userStream.current.getTracks().forEach(track => {
            peer.addTrack(track, userStream.current);
        });
        console.log('here handling callUser');
        console.log(userStream);
    }

    const createPeer = async (userId) => {

        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent; // on when partner send their streams to us .
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userId);

        return peer;
    }

    const handleNegotiationNeededEvent = async (userId) => {
        peer.createOffer().then(offer => {
            return peer.setLocalDescription(offer);
        }).then(() => {
            const payload = {
                target: userId,
                caller: socket.id,
                sdp: peer.localDescription
            };
            socket.emit('offer', payload);
        }).catch(e => console.log(e));
    }

    const handleReceiveCall = async (incoming) => {
        createPeer();
        const desc = new RTCSessionDescription(incoming.sdp);
        await peer.setRemoteDescription(desc);
        userStream.current.getTracks().forEach(track => peer.addTrack(track, userStream.current));
        const answer = await peer.createAnswer();

        await peer.setLocalDescription(answer);
        const payload = {
            target: incoming.caller,
            caller: socket.id,
            sdp: peer.localDescription

        }
        socket.emit('answer', payload);
        
    }

    const handleAnswer = async (message) => {
        const desc = new RTCSessionDescription(message.sdp);
        peer.setRemoteDescription(desc).catch(e => console.log(e));
    }

    const handleICECandidateEvent = async (e) => {
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate
            }
            socket.emit('ice-candidate', payload);
        }
    }

    const handleNewICECandidateMsg = (incoming) => {
        const candidate = new RTCIceCandidate(incoming);

        peer.addIceCandidate(candidate);

    }

    const handleTrackEvent = async (e) => {
        console.log('here handling trackEvent');
        partnerStream.current = e.streams[0];
        console.log(partnerStream);
    }
    const handleEndCall = () => {
        socket.emit('end-call' , { userId : cookies.userId , roomId })
        peer.close();
        navigate('/dashboard');
        window.location.reload();
    }
    const handleVolume = () => {
        setMute((prev) => !prev)
    }
    return (
        <div className="container-room" >
            {/* {userVideo.current.srcObject && <video ref={userVideo} autoPlay className='video-el' />}
            {otherUserVideo.current.srcObject && <video ref={otherUserVideo} autoPlay className='video-el'  />} */}
            <div className='video-chamber' >
                <ReactPlayer url={userStream.current} playing width = {400} muted = {mute} />
                <ReactPlayer url={partnerStream.current} playing width = {400} muted = {mute}/>
            </div>
            <div className='control'>
                <button onClick={handleVolume} id = 'vol-btn' >
                    {mute ? <MicOffIcon /> : <MicNoneIcon />  }
                </button>
                <button onClick={handleEndCall} className='end-call'>End Call</button>
            </div>
        </div>
    )
}
export default Room;