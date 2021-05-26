import React, { useState, useEffect } from 'react';
import {
    Form,
    Button,
    Col
} from 'react-bootstrap';
import axios from 'axios';

export default (props) => {

    const [series, setSeries] = useState(['hello']);
    const [seriesSelected, setSeriesSelected] = useState('');
    const [deckName, setDeckName] = useState('');
    const handleSeriesSelected = (e) => {
        setSeriesSelected(e.target.value);
    }
    const handleDeckNameChanged = (e) => {
        setDeckName(e.target.value);
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if(deckName === '' || seriesSelected === ''){
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        }else{
            try {
                let token = localStorage.getItem('token');
                let data = {
                    deckName:deckName,
                    seriesName:seriesSelected
                }
                let response = await axios.post('http://localhost:5000/weissschwarz-f48e0/us-central1/app/deck/addDeck', data, {
                    headers:{
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': 'Bearer ' + token  
                    }
                })
                console.log(response.data);
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    }

    useEffect(() => {
        axios.get('http://localhost:5000/weissschwarz-f48e0/us-central1/app/series/getAllSeries/')
        .then((response) => {
            let series = (response.data.series).map(item => item.seriesName);
            console.log(series);
            setSeries(series);
            setSeriesSelected(series[0]);
        }).catch((error) => {
            console.log(error);
            throw error;
        })
    }, [])

    return(
        <>
            <Col xs={12} sm={12} md={12} lg={12}>  
                <Button variant="danger" onClick={props.handleAddDeckClicked}> 
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
            </Col>
            <Col xs={12} sm={6} md={6} lg={4}>
                <Form onSubmit={handleFormSubmit} style={{marginTop:'20%'}}>
                    <Form.Group controlId="formSelectSeries">
                        <Form.Label>Series</Form.Label>
                        <Form.Control as="select" value={seriesSelected} onChange={handleSeriesSelected}>
                            {series.map((value, index) => (
                                <option key={index}>{value}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formEnterDeckName">
                        <Form.Label>Deck Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter your deck name" onChange={handleDeckNameChanged}/>
                        <Form.Text className="text-muted">
                            Please give your deck a unique name.
                        </Form.Text>
                    </Form.Group>
                 
                    <Button 
                        variant="danger" 
                        type="submit" 
                        style={{
                            width:'60%',
                            marginLeft:'20%',
                            marginRight:'20%',
                        }}
                    >
                        Save
                    </Button>
                </Form>
            </Col>
        </>
    )
};
