import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Table,
    Button,
    Card
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import firebase from '../firebase';

export default (props) => {

    const db = firebase.firestore();
    const [invited, setInvited] = useState([]);
    const [userId, setUserId] = useState('');
    const [inviteId, setInviteId] = useState('');
    const [acceptInvited, setAcceptedInvited] = useState(false);
    const [myDeck, setMyDeck] = useState([]);
    const [deckSelected, setDeckselected] = useState({});


    const handleInvitedAccepted = async (invite) => {
        setInviteId(invite.invite);
        //load user deck 
        let token = localStorage.getItem('token');
        try {
            let response = await axios.post('http://localhost:5000/weissschwarz-f48e0/us-central1/app/invite//acceptedInvited',
            { inviteId:invite.invite }, 
            {
                headers:{
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': 'Bearer ' + token  
                }
            });
            //console.log(response);
            setMyDeck(response.data.deck);
            setAcceptedInvited(true);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const handleDeckSelected = (deck) => {
        setDeckselected(deck);
    }

    const handleCancleDeckSelected = () => {
        setDeckselected({});
    }

    //load invite by userId
    useEffect(() => {
        let token = localStorage.getItem('token');
        axios.post('http://localhost:5000/weissschwarz-f48e0/us-central1/app/invite/getInvite', {}, {
            headers:{
                'Access-Control-Allow-Origin':'*',
                'Authorization': 'Bearer ' + token  
            }
        }).then((response) => {
            if(response.data.status === 'success'){
                setUserId(response.data.userId);
                setInvited(response.data.invite);
            }
        }).catch((error) => {
            console.log(error);
            throw error;
        })
    }, []);

    //looking invited realtime
    useEffect(() => {
        db.collection('invite').onSnapshot((snapShot) => {
            let dummy = [];
            snapShot.forEach((doc) => {
                if(doc.data().invited === userId){
                    console.log(doc.data());
                    dummy.push(doc.data());
                }
            })
            setInvited(dummy);
            console.log('looking for invited collection realtime');
        })
    }, [userId]);

    return(
        <>
            <Container>
                {!acceptInvited &&
                    <>
                        <Row style={{ margin:'2% 0%'}}>
                            <Col>
                                <h1>คำเชิญ</h1>
                            </Col>
                        </Row> 
                        <Row>
                            <Col>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invited.map((value, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{value.inviteName}</td>
                                                <td>
                                                    <Button 
                                                        variant="outline-danger"
                                                        onClick={() => {handleInvitedAccepted(value)}}
                                                        style={{
                                                            marginLeft:'10%'
                                                        }}
                                                    >
                                                        ตอบรับ
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </>
                }
                {/* show deck after accepted invited */}
                {acceptInvited && Object.keys(deckSelected).length === 0 &&
                    <Row>
                        <Col>
                            <h1>Select your deck</h1>
                            <hr/>
                        </Col>
                    </Row>
                }
                <Row style={{marginTop:'2%'}}>
                    {acceptInvited && Object.keys(deckSelected).length === 0 &&
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
                {/* show deck selected after select deck */}
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
                                        <Link to="/Play">
                                            <Button 
                                                style={{ width:'100%' }} 
                                                onClick={
                                                    () => {
                                                        props.handleInvitedReadyPlay({
                                                            deckId:deckSelected.DeckId,
                                                            opponentId:inviteId,
                                                        })
                                                    }}
                                            >
                                                Let's Play !
                                            </Button>
                                        </Link>
                                        <Button 
                                            variant="danger" 
                                            style={{ 
                                                width:'100%', 
                                                marginTop:'4%' 
                                            }}
                                            onClick={handleCancleDeckSelected}
                                        >
                                            เลือกเด็คใหม่
                                        </Button>
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