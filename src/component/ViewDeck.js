import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import firebase from '../firebase';
import { Modal, Button, Card, Row, Col, Container, SafeAnchor } from 'react-bootstrap'; 

function ViewDeck(props){

    //firestore
    const db = firebase.firestore();
    const { deckId } = useParams();
    const [deck, setDeck] = useState([]);
    const [show, setShow] = useState(false);
    const [modalCardId, setModalCardId] = useState('');
    const [modalCardUrl, setModalCardUrl] = useState('');

    const showCard = (index) => {
        setModalCardId(deck[index].CardId);
        setModalCardUrl(deck[index].cardUrl);
        setShow(true);
    }

    const handleClose = () => {
        setShow(false);
    }

    useEffect(() => {
        async function loadDeckById(deckId){
            try {
                let response  = await axios.get('http://localhost:5000/weissschwarz-f48e0/us-central1/app/deck/getDeckByDeckId/' + deckId);
                console.log(response.data);
                if(response.data.status === 'success'){
                    let cardIds = response.data.deck.CardIdList;
                    //get cardUrl by cardId
                    for(let card of cardIds){
                        console.log(card.CardId);
                        let snapshot = await db.collection('card').where('CardId', '==', card.CardId).get();
                        let cardUrl = {};
                        snapshot.forEach((doc) => {
                            for(let key in doc.data()){
                                card[key] = doc.data()[key];
                            }
                        });
                        console.log(card); 
                    }
                    setDeck(cardIds);
                }
            } catch (error) {
                console.log(error);
                throw error;
            }
            
        }
        loadDeckById(deckId);
    }, []);
   
    return(
        <>
            <Container fluid>
                <Row>
                    {deck.map((item, index) => (
                        <Col xs={6} md={2} lg={1}>
                            <Card
                                key={index}
                                style={{ 
                                    cursor:'pointer',
                                    marginTop:'20px', 
                                }}
                                onClick={() => {showCard(index)}}
                            >
                                <Card.Img variant="top" src={item.cardUrl} />
                                <p
                                    style={{
                                        position:'absolute',
                                        right:'0',
                                        bottom:'0',
                                        marginBottom:'0',
                                        backgroundColor:'black',
                                        color:'white',
                                        padding:'5%',
                                        opacity:'0.8',
                                    }}
                                >
                                    x {item.count}
                                </p>
                            </Card>
                        </Col>
                    ))}
                    {/* New Deck    */}
                    <Col xs={6} md={2} lg={1}>
                        <Card
                            style={{ 
                                cursor:'pointer',
                                marginTop:'20px', 
                                border:'none',
                            }}
                        >
                            <Card.Img variant="top" src={process.env.PUBLIC_URL + '/new_deck.PNG'} />
                            <Card.Text>+ Add Card</Card.Text>
                        </Card>
                    </Col>
                </Row>   
            </Container>
            {/* Modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header >
                    <Modal.Title>{modalCardId}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="show-grid">
                    <Container>
                        <Row>
                            <Col>
                                <img 
                                    src={modalCardUrl}
                                    alt="..."
                                    style={{
                                        width:'100%'
                                    }}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ViewDeck;