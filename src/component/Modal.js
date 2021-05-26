import React from 'react';
import { Modal, Button, Row, Col, Container, Table} from 'react-bootstrap';

export default (props) =>{

    return(
        <>
            <Modal 
                show={props.showModal} 
                aria-labelledby="contained-modal-title-vcenter" 
                onHide={props.handleModalClosed}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {props.modalItem.CardId} {props.modalItem.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="show-grid">
                    <Container>
                        <Row>
                            <Col xs={12} md={12} lg={6}>
                                <img style={{width:'16rem'}} src={props.modalItem.cardUrl} alt="..."/>
                            </Col>
                            <Col xs={12} md={12} lg={6}>
                                <Table striped bordered hover responsive>
                                    <tbody>
                                        {Object.keys(props.modalItem).map((prop, index) =>(
                                            prop !== 'cardUrl' && prop !== 'name' && prop !== 'CardId' && prop !== 'text' &&
                                            <tr key={index}>
                                                <td>{prop}</td>
                                                <td>{props.modalItem[prop]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col>
                                <h2>text : </h2>
                                {Array.isArray(props.modalItem['text']) &&
                                    props.modalItem['text'].map((value, index) => (
                                        <p key={index}>{value}</p>
                                ))}
                            </Col>
                        </Row>

                        {props.deckId !== undefined &&
                            <Row className="justify-content-center">
                                <Col xs={6} md={4} lg={6}>
                                    <Button 
                                        variant="danger" 
                                        style={{
                                            width:'100%', 
                                            marginTop:'20px'
                                        }}
                                        onClick={() => {props.addCardToDeck(props.modalItem)}}
                                    >
                                        เพิ่มลงเด็ค
                                    </Button>
                                </Col>
                            </Row>
                        }
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.handleModalClosed}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};

