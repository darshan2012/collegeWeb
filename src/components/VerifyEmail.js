import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Input, Label } from 'reactstrap';
import { url } from './MainComponent';
import { Col, Row } from 'react-bootstrap';

// import {UserContext} from './SignUp';



function VerifyEmail({ mail, handleSignUp }) {

    // const {getMail,handleSignUp}=useContext(UserContext)
    const [inputOtp, setInputOtp] = useState("");
    const [Otp, setOtp] = useState("");
    const [invalid, setInValid] = useState(false)

    useEffect(() => {
        getOtp();
    }, [])

    const getOtp = () => {
        setInValid(false)

        axios.post(`${url}users/getOtp`, ({ mail: mail }))
            .then((res) => {
                console.log("Here");
                setOtp(res.data);
            }).catch((err) => console.log(err))
    }
    const checkOtp = () => {
        if (Otp == inputOtp) {
            handleSignUp();
            window.location.href = '/login'
        }
        else {
            setInValid(true)
        }
    }
    return (
        <div className='container border' style={{ height: "500px" }}>

            {/* Enter Your Otp */}
            <div className='mx-auto ' style={{ width: "500px","marginTop":"200px" }}>
        <h4 className='my-auto mx-auto' >Enter the 4-digit code we sent to: {mail}</h4>
        <div className='d-flex mt-5'>

                <Input className='' maxLength={4} style={{ height: "50px", width: "350px" }} placeholder='Enter the OTP' value={inputOtp} onChange={(e) => setInputOtp(e.target.value)} type="text" />

                <Button className='btn btn-light' style={{ "height": "50px",  }} onClick={() => getOtp()}>Resend Otp</Button>

        </div>

            </div>
            <Row className=''>

            {
                    invalid && <div className='mx-auto fa-3 mt-2' style={{ "textAlign":"center" }}>
                        <h5 className='text-danger'>That code isn't valid. You can request a new one</h5>

                    </div>
                }



                {/* <Button className='btn-lg mt-3 mx-auto' style={{"width":"300px"}}  onClick={()=>getOtp()}>Resend Otp</Button> */}
                <Button className='btn-lg mt-3 mx-auto' style={{ "width": "170px" }} onClick={() => checkOtp()}>Verify</Button>
            
            </Row>

        </div>
    );
}

export default VerifyEmail;