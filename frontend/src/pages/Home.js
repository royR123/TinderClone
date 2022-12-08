import { useState } from 'react';
import Nav from "../components/Nav";
import AuthModel from '../components/AuthModel';
import './Home.css';
import backgroundimg from '../images/backgroundimg.webp';
import LoadingComponent from '../components/LoadingComponent'
const Home = ({ isLoading , setIsLoading }) => {
    const [showModel,setShowModel] = useState(false);
    const [isSignUp,setIsSignUp] = useState(true); // need to be signup == true
    const authToken = false;
    const handleClick = () => {
        console.log('clicked');
        setShowModel(true);
        setIsSignUp(true);
    };
    return (
        <>
            {isLoading && <LoadingComponent/>}
            {
                !isLoading &&
                <div className="container">
                    <Nav minimal = {false} 
                    authToken = {authToken} 
                    setShowModel = {setShowModel} 
                    showModel = {showModel} 
                    setIsSignUp = {setIsSignUp}
                    />
                    {!isLoading &&
                        <div className="home">
                            <h1 className='heading'>Swipe Right</h1>
                            <button className="primary-button" onClick={handleClick}>
                                {authToken ? "SignOut" : "Create Account"}
                            </button>
                            {showModel && <AuthModel setShowModel = {setShowModel}
                            isSignUp = {isSignUp} setIsSignUp = {setIsSignUp}
                            isLoading = {isLoading} setIsLoading = {setIsLoading}
                            />}
                        </div>
                    }
                </div>

            }
        </>
    );
}

export default Home;