import { getCardMediaUtilityClass } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useContext, useMemo, useState } from "react";
import { createContext } from "react";


const VideoContext = createContext(null);

export const useVideo = () => {
    return useContext(VideoContext);
}
export const VideoProvider = (props) => {
    // const 
    const [userStream , setUserStream] = useState(null);
    

    const [partnerStream , setPartnerStream] = useState(null);

    return (
        <VideoContext.Provider value = {{ setPartnerStream , setUserStream , userStream , partnerStream  }} >
            {props.children}
        </VideoContext.Provider>
    )
}