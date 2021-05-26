import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Row, Col, Container} from 'react-bootstrap'; 
import Modal from './Modal';
import ViewCard from './ViewCard';

function ViewDeck(){
    
    const { deckId } = useParams();
    const [deck, setDeck] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalItem, setModalItem] = useState({});

    const showCard = (card) => {
        const characterOrder = [ 'name', 'CardId', 'color', 'level', 'cost', 'power', 'soul', 'trigger', 'CardType', 'CharacterType', 'cardUrl', 'text' ];
        const climaxOrder = [ 'name', 'CardId','color', 'trigger', 'CardType', 'cardUrl', 'text' ];
        const eventOrder = [ 'level', 'cost', 'name', 'CardId','color', 'trigger', 'CardType', 'cardUrl', 'text' ];
        const tableItem = {};
        if(card.CardType === 'character'){
            characterOrder.forEach(key => {
                tableItem[key] = card[key];
            });
        }else if(card.CardType === 'event'){
            eventOrder.forEach(key => {
                tableItem[key] = card[key];
            })
        }else{
            climaxOrder.forEach(key => {
                tableItem[key] = card[key];
            })
        }
        setModalItem(tableItem);
        setShowModal(true);
    }

    const handleModalClosed = () => {
        setShowModal(false);
    }

    const handleIncreaseCardClicked = async (cardId) => {
        try {
            //เพิ่มจำนวนการ์ดใน database
            let response =  await axios.post('http://localhost:5000/weissschwarz-f48e0/us-central1/app/deck/addCard/', {
                deckId:deckId,
                cardId:cardId
            })
            console.log(response.data);
            //แสดงจำนวนการ์ดที่เพิ่มในหน้า frontend
            let dummyDeck = [...deck];
            for(let i = 0; i < dummyDeck.length; i++){
                if(dummyDeck[i].CardId === cardId){
                    dummyDeck[i].count++;
                }
            }
            setDeck(dummyDeck);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const handleDecreaseCardClicked = async (cardId) => {
        try {
            //ลดจำนวนการ์ดใน database
            let response =  await axios.post('http://localhost:5000/weissschwarz-f48e0/us-central1/app/deck/deleteCard/', {
                deckId:deckId,
                cardId:cardId
            })
            console.log(response.data);
            //แสดงจำนวนการ์ดที่เพิ่มในหน้า frontend
            let dummyDeck = [...deck];
            for(let i = 0; i < dummyDeck.length; i++){
                if(dummyDeck[i].CardId === cardId){
                    dummyDeck[i].count--;
                }
            }
            setDeck(dummyDeck);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    useEffect(() => {
        async function loadDeckById(deckId){
            try {
                let deckResponse  = await axios.get('http://localhost:5000/weissschwarz-f48e0/us-central1/app/deck/getDeckByDeckId/' + deckId);
                console.log(deckResponse.data);
                if(deckResponse.data.status === 'success'){
                    let cardIds = deckResponse.data.deck.CardIdList;
                    //get card data by cardId
                    let cardResponse = await axios.post('http://localhost:5000/weissschwarz-f48e0/us-central1/app/card/getCardByMultipleCardId', { cardIds })
                    console.log(cardResponse);
                    cardResponse.data.status === 'success' ? setDeck(cardResponse.data.cardData) : setDeck([]);
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
            <Container>
                <Row style={{marginTop:'50px'}}>
                    <Col lg={12}><h1>Buta bory</h1></Col>
                    <Col><hr /></Col>
                </Row>
                <Row>
                    {deck.map((item, index) => (
                        //ไม่แสดงการ์ดที่มี 0 ใบหรือน้อยกว่า
                        item.count !== 0 &&
                        <Col xs={6} md={3} lg={2} key={index}>
                            <Card
                                key={index}
                                style={{ 
                                    marginTop:'20px', 
                                }}
                            >
                                <Card.Img 
                                    variant="top" 
                                    src={item.cardUrl}
                                    onClick={() => {showCard(item)}}
                                    style={{ cursor:'pointer', }} 
                                />
                                <p
                                    style={{
                                        position:'absolute',
                                        right:'0',
                                        top:'0',
                                        marginBottom:'0',
                                        backgroundColor:'black',
                                        color:'white',
                                        padding:'5%',
                                        opacity:'0.8',
                                    }}
                                >
                                    x {item.count}
                                </p>
                                <Card.Text style={{textAlign:'center'}}>
                                    <Button 
                                        style={{
                                            float:'left', 
                                            margin:'5px 0px'
                                        }}
                                        onClick={() => {handleDecreaseCardClicked(item.CardId)}}
                                    >
                                        -
                                    </Button>
                                    {item.count}/4
                                    <Button 
                                        style={{
                                            float:'right', 
                                            margin:'5px 0px'
                                        }}
                                        onClick={() => {handleIncreaseCardClicked(item.CardId)}}
                                    >
                                        +
                                    </Button>
                                </Card.Text>
                            </Card>
                        </Col>
                    ))}
                    {/* New Deck */}
                    <Col xs={6} md={3} lg={2}>
                        {/* View card in this series */}
                        <Link 
                            to={'/MyDeck/' + deckId + '/Aobuta/addCard'}
                            style={{
                                color:'black',
                                textDecoration:'none',
                                textAlign:'center',
                            }}
                        >
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
                        </Link>
                    </Col>
                </Row>   
            </Container>
            {/* Modal */}
            <Modal showModal={showModal} modalItem={modalItem} handleModalClosed={handleModalClosed}/>
        </>
    )
}

export default ViewDeck;