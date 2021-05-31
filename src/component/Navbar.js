import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import axios from 'axios';

function MyNavbar(props){
    
    const LinkStyle = {
        color:'white',
        marginLeft:'20px',
        textDecoration:'none',
        padding:'10px'
    };

    const dropDownStyle = {
        color:'white',
        float:'right',
        opacity:'1.0',
    };

    const handleSignOutClicked = async() => {
        try {
            let token = localStorage.getItem('token');
            let response = await axios.post('http://localhost:5000/weissschwarz-f48e0/us-central1/app/signIn/signOut', {}, {
                headers:{
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': 'Bearer ' + token  
                }
            });
            if(response.data.status === 'success'){
                localStorage.removeItem('token');
                window.location.href = '/';
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    return(
        <>
            <Navbar bg="primary" variant="dark">
                <Nav className="mr-auto">
                    <Link style={LinkStyle} to="/MyDeck">My Deck</Link>
                    <Link style={LinkStyle} to="/Series">Series</Link>
                    <Link style={LinkStyle} to="/Play">Play</Link>
                    <Link style={LinkStyle} to="/Invited">Invited</Link>
                </Nav>
                <Nav>
                    <NavDropdown style={dropDownStyle} title={props.username} id="username-logout-dropdown">
                        <NavDropdown.Item onClick={handleSignOutClicked}>
                            Sign out
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar>
        </>
    )
}

export default MyNavbar;