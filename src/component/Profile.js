import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import { Container, Row } from 'react-bootstrap';
import ViewDeck from './ViewDeck';
import Series from './Series';
import Navbar from './Navbar';
import ViewCard from './ViewCard';
import MyDeck from './MyDeck';
import Play from './Play';
import Board from './Board';
import CardInfo from './CardInfo';
import Invited from './Invited';

function Profile(props){

    const [myDeck, setMyDeck] = useState([]);
    const [readyPlay, setReadyPlay] = useState(false);
    const [deckPlay, setDeckPlay] = useState([]); // contain only url
    const [userDeck, setUserDeck] = useState([]) // contain url and text
    //ใช้ userId และ opponentId update board ของเราและคู่แข่งแบบ realtime
    const [userId, setUserId] = useState('');
    const [opponentId, setOpponentId] = useState('');
    //CardUnfo
    const [cardInfoImage, setCardInfoImage] = useState('https://inwfile.com/s-l/z9w722.jpg');

    //ในกรณีที่ผู้เชิญพร้อมเล่น
    const handleReadyPlay = async (deckId) =>{
        //console.log(deckId);
        try {
            let token = localStorage.getItem('token');
            let response = await axios.post('http://localhost:5000/weissschwarz-f48e0/us-central1/app/board/prepareBoard', 
                { deckId:deckId },
                {
                    headers:{
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': 'Bearer ' + token  
                    }
                } 
            );
            //console.log(response);
            let cardImage = (response.data.userDeck).map(item => item.url);
            setUserDeck(response.data.userDeck)
            setOpponentId(response.data.opponentId);
            setUserId(response.data.userId);
            setDeckPlay(cardImage);
            setReadyPlay(true);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    //ในกรณีที่ผู้ถูกเชิญพร้อมเล่น
    const handleInvitedReadyPlay = async (data) => {
        try {
            let token = localStorage.getItem('token');
            let response = await axios.post('http://localhost:5000/weissschwarz-f48e0/us-central1/app/board/prepareInvitedBoard', 
                { deckId:data.deckId },
                {
                    headers:{
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': 'Bearer ' + token  
                    }
                } 
            );
            //console.log(response);
            let cardImage = (response.data.userDeck).map(item => item.url);
            setUserDeck(response.data.userDeck)
            setOpponentId(data.opponentId);
            setUserId(response.data.userId);
            setDeckPlay(cardImage);
            setReadyPlay(true);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    //ฟังก์ชันสำหรับ set รูปภาพให้ CardInfo
    const HandleCardOver = (e)=>{
        let url = e.target.src;
        if(!url.includes('empty_card.jpg'))
            setCardInfoImage(url);
    }

    //จบเกม เปลี่ยนสถานะเป็นไม่พร้อมเล่น
    const handleExitGame = () => {
        setReadyPlay(false);
    }

    //load deck by userId
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
    }, []);

    return(
        <>
            <Router>
                {!readyPlay && <Navbar username={props.username}/>}
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
                    <Route path="/Play">
                        {!readyPlay && 
                            <Play handleReadyPlay={handleReadyPlay}/>
                        }
                        {readyPlay && 
                            <Container fluid>
                                <Row>
                                    <Board 
                                        userDeck={deckPlay} 
                                        userId={userId} 
                                        opponentId={opponentId} 
                                        HandleCardOver={HandleCardOver}
                                    />
                                    <CardInfo 
                                        image={cardInfoImage} 
                                        userDeck={userDeck}
                                        handleExitGame={handleExitGame}
                                    />
                                </Row>
                            </Container>
                        }
                    </Route>
                    <Route path="/Invited">
                        <Invited handleInvitedReadyPlay={handleInvitedReadyPlay}/>
                    </Route>
                </Switch>
            </Router>
        </>
    )
}

export default Profile;

