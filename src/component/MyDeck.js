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
                    <div
                        key={index}
                        className="card"
                        style={{
                            width: "18rem",
                        }}
                    >
                        <img src={item.DeckImage} alt="..."/>
                        <p style={{textAlign:'center'}}>{item.DeckName}</p>
                    </div>
                )}
                <Card style={{ width: '18rem', marginLeft:'10px'}}>
                    <Card.Body 
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderStyle:'dashed',
                            height:'300px'
                        }}
                    >
                        <Card.Title style={{textAlign:'center'}}>+ New Deck</Card.Title>
                    </Card.Body>
                </Card>
            </Row>
        </>
    )
};