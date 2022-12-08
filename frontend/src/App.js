import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useState } from 'react';
import VideoCall from "./pages/VideoCall";
import Room from './pages/Room'
function App() {
  const [cookies ] = useCookies();
  const [isLoading,setIsLoading] = useState(false);
  const token = cookies.Token
  return (
        <Router>
          <Routes>
            <Route path="/" element = {<Home isLoading = {isLoading} setIsLoading = {setIsLoading}/>}/>
            {token && <Route path="/dashboard" element = {< Dashboard isLoading = {isLoading} setIsLoading = {setIsLoading}/>}/>}
            {token && <Route path="/onboarding" element = {< Onboarding/>}/>}
            {token && <Route path='/videoCall/:userId/:calledUserId' element = {<VideoCall />} />}
            {token && <Route path = '/room/:roomId' element = {<Room />} /> }
          </Routes>
        </Router>

  );
}

export default App;
