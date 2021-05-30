import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Table,
    Button,
    Card,
} from 'react-bootstrap';
import axios from 'axios';
import firebase from '../firebase';
import Invited from './Invited';

export default (props) => {

    const db = firebase.firestore();
    const [invite, setInvite] = useState(false);
    const [friends, setFriends] = useState([]);
    const [myInviteId, setMyInviteId] = useState('');
    const [ready, setReady] = useState(false);
    const [myDeck, setMyDeck] = useState([]);
    const [deckSelected, setDeckSelected] = useState({});

    const handleInvitedClicked = async (friend) =>{
        setInvite(true);
        try {
            let token = localStorage.getItem('token');
            let response = await axios.post('http://localhost:5000/weissschwarz-f48e0/us-central1/app/invite/addInvite', 
                { friendId:friend.friendId }, 
                {
                    headers:{
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': 'Bearer ' + token  
                    }
                });
            console.log(response.data);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const handleCancleInvite = async () => {
        setInvite(false);
        try {
            let response = await axios.post('http://localhost:5000/weissschwarz-f48e0/us-central1/app/invite/deleteInvite', {
                userId:myInviteId,
            });
            console.log(response.data);
            setReady(false);
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const getMyDeck = async() =>{
        let token = localStorage.getItem('token');
        try {
            let response = await axios.post('http://localhost:5000/weissschwarz-f48e0/us-central1/app/deck/getDeck',{}, {
                headers:{
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': 'Bearer ' + token  
                }
            })
            console.log(response.data);
            setMyDeck(response.data.deck);
        } catch (error) {
            console.log(error);
            throw error;      
        }
    };

    const handleDeckSelected = (deck) =>{
        setDeckSelected(deck);
    }

    useEffect(() => {
        let token = localStorage.getItem('token');
        axios.post('http://localhost:5000/weissschwarz-f48e0/us-central1/app/user/getFriendsByUserId', {}, {
            headers:{
                'Access-Control-Allow-Origin':'*',
                'Authorization': 'Bearer ' + token  
            }
        }).then((response) => {
            setMyInviteId(response.data.userId);
            if(response.data.status === 'success'){
                let friends = response.data.friends;
                db.collection('signIn').onSnapshot((snapShot) => {
                    snapShot.forEach((doc) => {
                        for(let i = 0; i < friends.length; i++){
                            if(friends[i]['friendId'] === doc.id){
                                friends[i]['status'] = doc.data()['status'];
                            }
                        }
                        // console.log(friends);
                        setFriends([...friends]);
                    })
                })
            }
        }).catch((error) => {
            console.log(error);
            throw error;
        })
    }, []);

    useEffect(() => {
        db.collection('invite').onSnapshot((snapShot) => {
            snapShot.forEach((doc) => {
                if(doc.id === myInviteId){
                    if(doc.data().status === 'accepted'){
                        setReady(true);
                        getMyDeck();
                    }else if(doc.data().status === 'waiting'){
                        setInvite(true);
                        setReady(false);
                        setMyDeck([]);
                    }
                }
                //console.log('looking for invite collection realtime');
            })
        })
    }, [myInviteId]);

    return(
        <>
            <Container>
                {myInviteId !== '' &&
                    <Invited invited={myInviteId}/>
                }
                {!invite &&
                    <>
                        <Row style={{ margin:'2% 0%'}}>
                            <Col>
                                <h1>เชิญคู่แข่ง</h1>
                            </Col>
                        </Row> 
                        <Row>
                            <Col>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {friends.map((value, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{value.username}</td>
                                            <td>
                                                {value.status}
                                                {value.status === 'online' &&
                                                    <Button 
                                                        variant="outline-success"
                                                        onClick={() => {handleInvitedClicked(value)}}
                                                        style={{
                                                            marginLeft:'10%'
                                                        }}
                                                    >
                                                        เชิญ
                                                    </Button>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </>
                }
                {/* waiting for accept invited */}
                {invite && !ready &&
                    <Row className="justify-content-center">
                        <Col xs={12} md={12} lg={12}>
                            <h1 style={{textAlign:'center'}}>กำลังรอการตอบรับ...</h1>
                        </Col>
                        <Col xs={6} md={3} lg={2}>
                            <Button 
                                variant="danger"
                                onClick={handleCancleInvite}
                            >
                                ยกเลิกคำขอ
                            </Button>
                        </Col>
                    </Row>
                }
                <Row style={{marginTop:'2%'}}>
                    {ready && Object.keys(deckSelected).length === 0 &&
                        myDeck.map((item, index) =>
                            <Col xs={6} md={3} lg={2} key={index}>
                                <Card 
                                    style={{ 
                                        border:'none',
                                        cursor:'pointer'
                                    }}
                                    onClick={() => {handleDeckSelected(item)}}
                                >
                                    <Card.Img variant="top" src={item.DeckImage}/>
                                    <Card.Body >
                                        <Card.Title style={{textAlign:'center'}}>{item.DeckName}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    }
                </Row>
                {Object.keys(deckSelected).length !== 0 &&
                    <>
                        <Row className="justify-content-center">
                            <Col xs={6} sm={6} md={3} lg={3}>
                                <Card 
                                    style={{ 
                                        border:'none',
                                    }}
                                >
                                    <Card.Img variant="top" src={deckSelected.DeckImage}/>
                                    <Card.Body >
                                        <Card.Title style={{textAlign:'center'}}>{deckSelected.DeckName}</Card.Title>
                                        <Button 
                                            style={{ width:'100%' }} 
                                            onClick={() => {props.handleReadyPlay(deckSelected.DeckId)}}
                                        >
                                            Let's Play !
                                        </Button>
                                        <Button variant="danger" style={{ width:'100%', marginTop:'4%' }}>เลือกเด็คใหม่</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                }
            </Container>
        </>
    )
};