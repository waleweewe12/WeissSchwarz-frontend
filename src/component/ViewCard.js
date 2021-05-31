import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Container, 
    Row,
    Col,
    Button, 
} from 'react-bootstrap';
import Modal from './Modal';

export default (props) => {
    const { series, deckId } = useParams();
    const [cards, setCards] = useState([]);
    const [seriesImage, setSeriesImage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalItem, setModalItem] = useState({});

    useEffect(() => {
        axios.get('http://localhost:5000/weissschwarz-f48e0/us-central1/app/card/getCardBySeriesName/' + (series === undefined ? props.series : series))
        .then((response) => {
            //console.log(response.data.cards);
            if(response.data.status === 'success'){
                setCards(response.data.cards);
                setSeriesImage(response.data.seriesImage);
            }
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    const handleCardClicked = (card) =>{
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
    
    const handleModalClosed = () =>{
        setShowModal(false);
    }

    const addCardToDeck = async (card) =>{
        try {
            let response = await axios.post('http://localhost:5000/weissschwarz-f48e0/us-central1/app/deck/addCard/', {
                deckId:deckId,
                cardId:card.CardId
            });
            console.log(response.data);
        } catch (error) {
            console.log(error);
            throw error;
        }
        setShowModal(false);
    }
    
    return(
        <>
            <Container style={{marginTop:'2%'}}>
                {/* แสดงปุ่มย้อนกลับ มี 2 กรณี คือ กลับไปยังหน้า Mydeck กับ กลับไปยังหน้า Series */}
                <Row style={{marginBottom:'2%'}}>
                    <Col>
                        {deckId !== undefined &&
                            <Link to={'/MyDeck/' + deckId}>
                                <Button variant="danger"> 
                                    <img 
                                        src={process.env.PUBLIC_URL + '/back-button-3.svg'}
                                        style={{
                                            width:'1rem',
                                            marginRight:'1rem'
                                        }} 
                                        alt="..."
                                    />
                                    กลับไปหน้า deck
                                </Button>
                            </Link>
                        }
                        {deckId === undefined &&
                            <Link to={'/Series'}>
                                <Button variant="danger">
                                    <img 
                                        src={process.env.PUBLIC_URL + '/back-button-3.svg'}
                                        style={{
                                            width:'1rem',
                                            marginRight:'1rem'
                                        }} 
                                        alt="..."
                                    /> 
                                    กลับไปหน้า series
                                </Button>
                            </Link>
                        }
                    </Col>
                </Row>
                {/* แสดงรูปประจำซีรีย์ */}
                <Row>
                    <Col>
                        <img style={{width:'16rem'}} src={seriesImage} alt="..."/>
                        <hr />
                    </Col>
                </Row>
                {/* แสดงการ์ดในซีรีย์ แยกตามสี */}
                {['red', 'green', 'blue', 'yellow'].map((color, index) => (
                    <Row key={index}>
                        {cards.filter(value => value.color === color).map((value, index) => (
                            <img 
                                key={index} 
                                style={style.cardStyle} 
                                src={value.cardUrl} 
                                alt="..."
                                onClick={() => {handleCardClicked(value)}}
                            />
                        ))}
                    </Row>
                ))}
            </Container>
            {/* modal แสดงรายละเอียดการ์ดเมื่อกดที่การ์ด */}
            <Modal 
                showModal={showModal} 
                modalItem={modalItem} 
                handleModalClosed={handleModalClosed}
                deckId={deckId}
                addCardToDeck={addCardToDeck}
            />
        </>
    )
};

const style = {
    cardStyle:{
        width:'6rem', 
        padding:'0px',
        margin:'5px 5px',
        cursor:'pointer',
    }
};