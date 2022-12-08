import './AuthModel.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from '../utils/axios'
const AuthModel = ({ setShowModel , isSignUp , setIsSignUp , setIsLoading}) => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [cookies , setCookie , removeCookie] = useCookies(['user']);
    // const userId = cookies.userId;
    const [error,setError] = useState(null);
    const handleClick = () => {
        setShowModel(false);
    };
    let navigate = useNavigate(); 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(() => true)
        setTimeout(() => {
            
        }, 1500);
        try {
            if( isSignUp && (password !== confirmPassword)){ 
                setError("PassWord must be same in confirm password");
            }else{
                const response = await axios.post(`/${isSignUp? 'signup' : 'login'}`,{
                    email,password
                },{
                    headers:{
                        "Authorisation" : `Bearer ${cookies.Token}`
                    }
                });

                if(response.status === 201){
                    // console.log(response.data.sanitizedEmail);
                    console.log("here");
                    setCookie("Email",response.data.email,{maxAge:24*60*60});
                    setCookie("Token",response.data.token,{maxAge:24*60*60});
                    setCookie("userId",response.data.user_id,{maxAge:24*60*60});
                    if(isSignUp)navigate('/onboarding');
                    else if(!isSignUp)navigate('/dashboard');
                }else{
                    console.log("not successful");
                }
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(() => false)
    };
    return (
        <div className="auth-model">

            <div onClick = {handleClick} className = 'cross'>X</div>
            <h3>
                {isSignUp ? "CREATE ACCOUNT" : "LOG IN"}
            </h3>
            <form onSubmit={handleSubmit}>
                <input 
                    autoComplete='off'
                    type="email"
                    id = 'email'
                    name = "email"
                    placeholder='Enter your email'
                    required 
                    value = {email}
                    onChange={(e) => {setEmail(e.target.value)}}
                />
                <input 
                    type="password"
                    id = 'password'
                    name = "password"
                    placeholder='Enter your Password'
                    required 
                    value = {password}
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                {isSignUp && <input 
                    type="password"
                    id = 'confirmPassword'
                    name = "confirmPassword"
                    placeholder='Enter confirm your Password'
                    required 
                    value = {confirmPassword}
                    onChange={(e) => {setConfirmPassword(e.target.value)}}
                />}
                <input className='submit-btn' type='submit' />
            </form>
        </div>

    );
}
export default AuthModel;