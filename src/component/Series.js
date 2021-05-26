import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Col, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";

function NewDeck(){

    const [allCardSeries, setAllCardSeries] = useState([]);
    const [allSeries, setAllSeries] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/weissschwarz-f48e0/us-central1/app/series/getAllSeries')
        .then((response) => {
            setAllSeries(response.data.series);
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    return(
        <>
            <Container>
                <Row style={{marginTop:'2%'}}>
                    {/* Display all series */}
                    {allSeries.map((value, index) => (
                        <Col key={index}>
                            <Link to={'Series/' + value.seriesName}>
                                <img 
                                    src={value.seriesImage} 
                                    style={{ width:'18rem' }} 
                                    alt="..."
                                />
                            </Link>
                            <p>{value.seriesName}</p>
                        </Col>
                    ))
                    }
                </Row>
            </Container>
        </>
    )
}

export default NewDeck;