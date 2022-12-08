import axios from '../utils/axios';
import { useEffect, useState , useRef} from 'react';
import './MatchesDisplay.css'
import { useCookies } from 'react-cookie';
import LoadingComponent from './LoadingComponent'
const MatchesDisplay = ({ matches , setClickedUser , isLoading , setIsLoading }) => {
    console.log(matches);
    const [cookies] = useCookies();
    console.log(typeof matches);
    const matchedUserIds = matches.map((user_id) => user_id)
    console.log(matchedUserIds);
    console.log(typeof matchedUserIds)
    const [matchedProfiles , setMatchedProfile] = useState([]);
    const isCalled = useRef(false);
    const getMatchedUsers = async () => {
        setIsLoading(() => true);
        try {
            if(isCalled.current == true){
                console.log("inside getMatchedUsers functions");
                // console.log(matches)
                const response = await axios.get('/getUsers',{
                    params : { userIds : JSON.stringify(matchedUserIds) , userId : cookies.userId},
                    headers:{
                        "Authorisation" : `Bearer ${cookies.Token}`
                    }
                })
                console.log(response.data);
                setMatchedProfile(() => (response.data));
                console.log(matchedProfiles);
        

            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(() => false);
    }
    useEffect(() => {
        console.log("here in useEffect of MatchesDisplay")
        getMatchedUsers();
        isCalled.current  = true;
    },[matches])

    const handleClick = (clickedUser) => {
        setClickedUser(() => clickedUser)
        // alert("you clicked me");
    }
    
    const filteredMatchedProfiles = matchedProfiles.filter(matchedProfile => matchedProfile.matches.indexOf(cookies.userId) !== -1)
    return (
    <div className="matches-display">
        {
            isLoading && <LoadingComponent />
        }
        {
            !isLoading &&
            <>
                <h2 id = "heading">Matches</h2>
                {
                    filteredMatchedProfiles?.map((match,index) => (
                        <div key={match?.user_id} className = "match-card" >
                            <div className='img-container'>
                                <img src= {match?.url} alt = {match?.first_name + 'profile'} id = "match-img" onClick={() => handleClick(match) }/>
                            </div>
                            <h3>{match?.first_name}</h3>
                        </div>
                    ))
                }
            </>
        }
    </div>
    ); 
}
export default MatchesDisplay;