import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Card, Button } from 'react-bootstrap';

export default (props) => {
    return(
        <>
            <Row 
                style={{
                    marginTop:'25px',
                    marginLeft:'10%',
                }}
            >
                {props.myDeck.map((item, index) =>
                    <Card 
                        style={{ 
                            width: '10rem', 
                            border:'none',
                            marginRight:'50px'
                        }}
                        key={index}
                    >
                        <Link to={'/MyDeck/' + item.DeckId}>
                            <Card.Img variant="top" src={item.DeckImage} onClick={props.handleViewDeckClicked(item.DeckId)}/>
                        </Link>
                        <Card.Body >
                            <Card.Title style={{textAlign:'center'}}>{item.DeckName}</Card.Title>
                        </Card.Body>
                    </Card>
                )}
                <Card style={{ width: '14rem', marginRight:'50px'}}>
                    <Card.Body 
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderStyle:'dashed',
                            height:'16rem',
                        }}
                    >
                        <Card.Title style={{textAlign:'center'}}>+ New Deck</Card.Title>
                    </Card.Body>
                </Card>
            </Row>
        </>
    )
};