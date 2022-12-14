import React, { useRef, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Input } from 'reactstrap';
import axios from 'axios';
const Axios = axios.create();


function SliderImage({ image, id, deleteImage, editImage }) {

    const fileRef = useRef();



    const handleChange = (e) => {
        editImage(id, e.target.files[0]);
    };

    return (
                <Card className='row m-5 border-5 '>
                    <Card.Header className=''>
                        <div className='col ms-auto'>
                        <Button  className='btn btn-md btn-secondary' onClick={() => fileRef.current.click()}>
                            Edit
                        </Button>
                        <Button className='btn btn-md btn-danger  ms-2' onClick={() => deleteImage(id)}>delete</Button>
                        <input
                            ref={fileRef}
                            onChange={handleChange}

                            type="file"
                            hidden
                        />
                        
                        </div>
                        
                    </Card.Header>
                    <Card.Body>
                        <img
                            height="450px"
                            width="100%"
                            src={image}
                            alt="First slide"
                        >

                        </img>
                    </Card.Body>
                </Card>
    );
}

export default SliderImage;