import React,{useState, useEffect} from 'react';
import LogIn from './component/LogIn';
import axios from 'axios';
import Profile from './component/Profile';
import Register from './component/Register';
import RegisterStatus from './component/RegisterStatus';
import ResetPassword from './component/ResetPassword';
import ResetPasswordStatus from './component/ResetPasswordStatus';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
 
  useEffect(()=>{
    axios.post('http://localhost:5000/weissschwarz-f48e0/us-central1/app/signIn/auth', {}, {
      headers:{
        Authorization: 'Bearer ' + localStorage.getItem('token')  
      }
    }).then((response) => {
      //console.log(response.data);
      if(response.data.status === 'success'){
        setIsLoggedIn(true);
      }
    }).catch((error) => {
      console.log(error);
      throw error;
    })
  },[]);

  return (
    <>
      <Router>
        <Switch>
          {isLoggedIn ? <Route path="/" component={Profile}/> :
            <Route path="/" exact>
              <LogIn setIsLoggedIn={setIsLoggedIn}/>
            </Route>
          }
          <Route path="/register" exact component={Register}/>
          <Route path="/register/:status" exact component={RegisterStatus}/>
          <Route path="/resetpassword" exact component={ResetPassword}/>
          <Route path="/resetpassword/:status/" exact component={ResetPasswordStatus}/>
          <Route path="/resetpassword/:status/:id" component={ResetPasswordStatus}/>
        </Switch>
      </Router>
    </>
  )
}

export default App;
