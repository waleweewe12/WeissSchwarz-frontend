import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Row, Card, Col, Container} from 'react-bootstrap';
import AddDeck from './AddDeck';

export default (props) => {

    const [addDeck, setAddDeck] = useState(false);
    
    const handleAddDeckClicked = () => {
        setAddDeck(!addDeck);
    }

    return(
        <>
            <Container fluid>
                {!addDeck &&
                    <Row 
                        style={{
                            marginTop:'25px',
                            marginLeft:'10%',
                        }}
                    >
                        {props.myDeck.map((item, index) =>
                            <Col xs={6} md={3} lg={2} key={index}>
                                <Card 
                                    style={{ 
                                        border:'none',
                                    }}
                                >
                                    <Link to={'/MyDeck/' + item.DeckId}>
                                        <Card.Img variant="top" src={item.DeckImage}/>
                                    </Link>
                                    <Card.Body >
                                        <Card.Title style={{textAlign:'center'}}>{item.DeckName}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )}
                        <Col xs={6} md={3} lg={2}>
                                <Card 
                                    style={{ 
                                        border:'none',
                                        cursor:'pointer',
                                    }}
                                    onClick={handleAddDeckClicked}
                                >
                                    <Card.Img variant="top" src={process.env.PUBLIC_URL + '/new_deck.PNG'}/>
                                    <Card.Body >
                                        <Card.Title style={{textAlign:'center'}}>+ New Deck</Card.Title>
                                    </Card.Body>
                                </Card>
                        </Col>
                    </Row>
                }
                {addDeck &&
                    <Row 
                        className="justify-content-center"
                        style={{
                            marginTop:'2%',
                        }}
                    >
                        <AddDeck handleAddDeckClicked={handleAddDeckClicked}/>
                    </Row>
                }
            </Container>
        </>
    )
};