import { useState } from "react";
import { useCallback } from "react";
import { useContext, useEffect, useMemo } from "react";
import { createContext } from "react";

const PeerContext = createContext(null);

export const usePeer = () => useContext(PeerContext);
console.log('inside Peer context');
export const PeerProvider = (props) => {
    const [remoteStream,setRemoteStream] = useState(null);
    const [mySdp , setMySdp] = useState(null);
    const [othersSdp , setOthersSdp] = useState(null);
    const peer = useMemo(() => 
        new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ]
        })
    ,[]);
    console.log(peer);
    const createOffer = async () => {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        setMySdp(offer);
        return offer;
    }

    const createAnswer = async (offer) => {
        peer.setRemoteDescription(offer);
        setOthersSdp(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        setMySdp(answer);
        return answer;
    }
    const setRemoteAnswer = async (answer) => {
        setOthersSdp(answer);
        peer.setRemoteDescription(answer);
    }

    // const callUser = (userId) => {
    //     createPeer(userId);
    //     userStream.getTracks().forEach(track => {
    //         peer.addTrack(track,userStream);
    //     });
    //     console.log('here handling callUser' );
    //     console.log(userStream);
    // }

    const sendStream = async (stream) => {
        const tracks = stream.getTracks();
        for(const track of tracks){
            peer.addTrack(track,stream);
        }
    }
    const handleTrackEvent = useCallback(
        (e) => {
            const streams = e.streams;
            setRemoteStream(() => streams[0]);

        } , []
    )

    useEffect(() => {
        peer.addEventListener('track' , handleTrackEvent)
        // peer.addEventListener('negotiationneeded',handleNegotiationNeeded);
        return () => {
            peer.removeEventListener('track' , handleTrackEvent);
            // peer.removeEventListener('negotiationneeded',handleNegotiationNeeded);
        }
    },[peer])
    return (
        <PeerContext.Provider value = {{ peer , createOffer , createAnswer , setRemoteAnswer , sendStream , remoteStream , mySdp , othersSdp}} >
            {props.children}
        </PeerContext.Provider>
    )
}