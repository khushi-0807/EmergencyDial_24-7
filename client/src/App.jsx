import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeFirst from "./Components/HomeFirst";
import Home from "./Components/Home";
import Login from "./Components/Login"
import SignupUser from "./Components/SignupUser";
import SignupEmergency from "./Components/SignupEmergency";
import Signup from "./Components/Signup";
import CompanyList from "./Components/CompanyList";
import EmergencyProviderDetails from "./Components/EmergencyProviderDetails";
import EmergencyProvider from "./Components/EmergencyProvider";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeFirst />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signupuser" element={<SignupUser/>}/>
        <Route path="/signupemergency" element={<SignupEmergency/>}/>
        <Route path="/companylist" element={<CompanyList/>}/>
        <Route path="/emergencyproviderdetails" element={<EmergencyProviderDetails/>}/>
        <Route path="/emergencyprovider" element={<EmergencyProvider/>}/>
      </Routes>
    </Router>
  );
}

export default App;