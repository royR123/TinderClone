import colorlogo from '../images/color-logo.png'
import whitelogo from '../images/logo_white.png'
import './Nav.css'
const Nav = ({ minimal , authToken , setShowModel, showModel , setIsSignUp }) => {
    const handleClick = () => {
        setShowModel(true);
        setIsSignUp(false);
    };
    
    return (   
        <div className='nav'>
            <div className="logo-container">
                <img className="logo" src = {minimal ? colorlogo : whitelogo} />
            </div>
            {!authToken && !minimal &&
            <button  
            className='nav-button' onClick = {handleClick} disabled = {showModel} >
                Log in
            </button>}
        </div>
    );
}

export default Nav;