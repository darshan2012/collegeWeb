import React from 'react';
import { Col, Row } from 'react-bootstrap';
import LeftSide from './LeftSide';
import UserLogin from './login';
import RightSide from './RightSide';
import SignUp from './SignUp';
import '../CSS/login.css';
import MainNavbar from './MainNavbar';

function Userlog({logo,setlogin,setUser}) {
    return (
        <>
        {/* <a href='/' className='logo bg-dark w-100 m-0' >
       <img  height={50} width={100} src='logo2.png' className= ""/>

       
       </a> */}
{/* <MainNavbar /> */}
       <a href='/' className='logo container' >
       <img  height={40} width={100} src='https://res.cloudinary.com/dmkfgsff7/image/upload/v1647927035/CollegeWeb/logo2_baqdhm.png' className= "ms-5"/>
       
       </a>
        <Row className='ms-md ms-1'>
            
            <Col>
            <SignUp setlogin={setlogin} setUser={setUser}/> 
            </Col>
            <Col className='my-auto'>
            <RightSide  />
            </Col>
        </Row>
        </>
        
    );
}

export default Userlog;