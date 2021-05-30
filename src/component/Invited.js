import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Table,
    Button,
} from 'react-bootstrap';
import axios from 'axios';
import firebase from '../firebase';

export default (props) => {

    const db = firebase.firestore();
    const [invited, setInvited] = useState([]);

    useEffect(() => {
        db.collection('invite').onSnapshot((snapShot) => {
            let dummy = [];
            snapShot.forEach((doc) => {
                if(doc.data().invited === props.invited){
                    console.log(doc.data());
                    dummy.push(doc.data());
                }
            })
            setInvited(dummy);
            console.log('looking for invited collection realtime');
        })
    }, []);

    return(
        <>
            {invited.length !== 0 &&
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
                                                    // onClick={() => {handleInvitedClicked(value)}}
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
        </>
    )
};