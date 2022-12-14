import React, { useRef, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Input } from 'reactstrap';
import axios from 'axios';
const Axios = axios.create();


function Image({ image, id, deleteImage, editImage }) {

    const fileRef = useRef();
    

    const handleChange = (e) => {
        editImage(id, e.target.files[0]);
    };

    return (
                <Card className='row'>
                    
                    <Card.Body>
                        <img
                            height="300px"
                            width="100%"
                            src={image}
                            alt="First slide"
                        >

                        </img>
                    </Card.Body>
                    <Card.Body className=''>
                        <div className='col ms-auto'>
                        <Button  className='btn  btn-secondary' onClick={() => fileRef.current.click()}>
                            Edit
                        </Button>
                        <Button className='btn btn-danger  ms-1' onClick={() => deleteImage(id)}>delete</Button>
                        <input
                            ref={fileRef}
                            onChange={handleChange}
                            type="file"
                            hidden
                        />
                        
                        </div>
                        
                    </Card.Body>
                </Card>
    );
}

export default Image;