import axios from 'axios';
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

import { Container, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { headers,url } from './MainComponent';
import Search from './Search';

function MainNavbar({ user }) {
    const handleLogOut = () => {
       localStorage.removeItem('JWTtoken');
        window.location.reload();
    }
    return (
        <div  >


            <div className=''>
                <Navbar  collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Container>
                        {/* <Navbar.Brand href="/home">CollegeWeb</Navbar.Brand> */}
                        <Navbar.Brand href="/" style={{ overflow: "hidden" }}><img height={50} width={70} src='https://res.cloudinary.com/dofftzsmf/image/upload/v1646578435/CollegeWeb_logo/logo2_iggth9.png' className="  "
                        /></Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />


                        {/* <Form className="d-flex ms-auto col-md-4 col-12 ">
                            <FormControl
                                type="search"
                                placeholder="Search"

                                aria-label="Search"
                            />
                            <Button variant="outline-success">Search</Button>
                        </Form> */}
                        <Search />
                        
                        <Navbar.Collapse id="responsive-navbar-nav">


                            <Nav className="ms-auto">
                                <Link className='nav-link' to="/" >Home</Link>
                                <Link className='nav-link' to="/colleges">Colleges</Link>
                                <Link className='nav-link' to="/contactus">Contact Us</Link>
                                <Link className='nav-link' to="/aboutus">
                                    About Us
                                </Link>
                                {user ?
                                    <div className='nav-link text-light'>
                                        
                                        <button className='btn m-0 p-0  text-secondary' cursor="pointer" onClick={handleLogOut}>
                                        logOut</button>
                                    </div> :

                                    <div className='nav-link' style={{ textDecoration: 'none' }} >
                                        <Link className='text-light' to="/login">
                                            Login /
                                        </Link>
                                        <Link className=' text-light ms-1 ' to="/signup">
                                            SignUp
                                        </Link>

                                    </div>
                                }
                                            
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        </div>
    );
}
export default MainNavbar;

{/* <Navbar className='bg-primary'>
            <NavbarBrand className='mx-5'>CollegeWeb</NavbarBrand>
                <Nav className='ms-auto'>
                    <NavItem className='mx-2'>
                        <NavLink style={{color:"white"}} className='nav-link' to="#">Home</NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink style={{color:"white"}} className='nav-link mx-2' to="#">Colleges</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink style={{color:"white"}} className='nav-link mx-2' to="#">AboutUs</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink style={{color:"white"}} className='nav-link mx-2' to="#">ContactUs</NavLink>
                    </NavItem>
                    

                </Nav>
            </Navbar>
           
        </div>
    );
} */}







