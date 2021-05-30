import React from 'react';
import { Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom';

function MyNavbar(){
    const LinkStyle = {
        color:'white',
        marginLeft:'20px',
        textDecoration:'none',
        padding:'10px'
    };
    return(
        <>
            <Navbar bg="primary" variant="dark">
                <Nav className="mr-auto">
                    <Link style={LinkStyle} to="/MyDeck">My Deck</Link>
                    <Link style={LinkStyle} to="/Series">Series</Link>
                    <Link style={LinkStyle} to="/Play">Play</Link>
                    <Link style={LinkStyle} to="/Invited">Invited</Link>
                </Nav>
            </Navbar>
        </>
    )
}

export default MyNavbar;