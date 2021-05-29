import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import ViewDeck from './ViewDeck';
import Series from './Series';
import Navbar from './Navbar';
import ViewCard from './ViewCard';
import MyDeck from './MyDeck';
import Friends from './Friends';

function Profile(){

    const [myDeck, setMyDeck] = useState([]);

    useEffect(() => {
        async function loadMyDeck(){
            try {
                let token = localStorage.getItem('token');
                let response = await axios.post('http://localhost:5000/weissschwarz-f48e0/us-central1/app/deck/getDeck', {}, {
                    headers:{
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': 'Bearer ' + token  
                    }
                })
                //get deck success
                //console.log(response.data);
                if(response.data.status === 'success'){
                    setMyDeck(response.data.deck);
                }
            } catch (error) {
                //console.log(error);
                throw error;
            }
        }
        loadMyDeck();
    }, [])

    return(
        <>
            <Router>
                <Navbar/>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/MyDeck" />
                    </Route>
                    <Route exact path="/MyDeck">
                        <MyDeck myDeck={myDeck}/>
                    </Route>
                    <Route exact path="/MyDeck/:deckId">
                        <ViewDeck/>
                    </Route>
                    <Route exact path="/MyDeck/:deckId/:series/addCard">
                        <ViewCard />
                    </Route>
                    <Route exact path="/Series">
                        <Series />
                    </Route>
                    <Route path="/Series/:series">
                        <ViewCard />
                    </Route>
                    <Route path="/Friends">
                        <Friends />
                    </Route>
                    <Route path="/Invited">
                        <p>Invited</p>
                    </Route>
                </Switch>
            </Router>
        </>
    )
}

export default Profile;

