import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom';

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

    const handleSignOutClicked = () =>{
        localStorage.removeItem('token');
        window.location.href = '/';
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