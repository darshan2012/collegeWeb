import React, { useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CollegeAbouUSComp from './CollegeAbouUSComp';
import CollegeNavBar from './CollegeNavBar';
import { CollegeContext, headers } from './MainComponent';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';


const Axios = axios.create();

function CollegeAboutUs({ isAdmin }) {
    const { collegeId } = useParams();
    // const {  } = useContext(CollegeContext)
    const [isOpen, setIsOpen] = useState(false);
    const [newImg, setNewImg] = useState("");
    const [About, setAbout] = useState();

    useEffect(async () => {
        axios.get(`http://localhost:4200/college/${collegeId}/about`)
            .then((res) => {
                console.log(res.data)
                setAbout(res.data);
            })
    }, [])

    function delAboutComp(_id) {
        axios.delete(`http://localhost:4200/college/${collegeId}/about/${_id}`, { headers: headers })
            .then((res) => {
                console.log(res.data.json);
                setAbout(res.data)
            })
            .catch((Err) => console.log(Err))
    }

    const changeNewImage = (e) => {
        const formData = new FormData()
        formData.append("file", e.target.files[0])
        formData.append("upload_preset", "my-uploads")
        formData.append("API_SECRET", "N6vRi9M2b8Tfwsesw1CLLQzzeHA");
        Axios.post("https://api.cloudinary.com/v1_1/dofftzsmf/image/upload", formData)
            .then((res) => {

                setNewImg(res.data.url);
                // console.log(res.data.url);
            }).catch((Err) => console.log(Err))
    }

    function handleSubmit(event) {
        // console.log("Here")
        event.preventDefault();
        const title = event.target.elements.title.value;
        const Content = event.target.elements.Content.value;
        axios.post(`http://localhost:4200/college/${collegeId}/about`,
            { "title": title, "imageUrl": newImg, "description": Content }, { headers: headers })
            .then((res) => {
                console.log(res.data);
                // setAbout(res.data)
                setAbout(res.data)
                // alert("Component Added Successfuly");
                setIsOpen(false)
                setNewImg("")
            })
            .catch((err) => console.log(err));
        // window.location.reload(false);

    }

    const newcomp = {
        imageUrl: 'https://picsum.photos/500/300?img=3',
        title: "Campus",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    };
    // const About = aboutUS;
    var isOdd = 1;
    return (
        <>
            
               
                    <Modal show={isOpen} onHide={() => setIsOpen(false)} width="500px">
                        <Modal.Header closeButton >
                            Upload About
                        </Modal.Header>
                        <Modal.Body>
                            <div className='row'>
                                <div className='col-6'>
                                    <input type='file' onChange={(event) => changeNewImage(event)} />
                                    <img src={newImg} className='mt-3' height="85%" width="100%" />
                                </div>
                                <div className='col-6'>
                                    <form onSubmit={(event) => handleSubmit(event)}>
                                        <input type="text" name="title" placeholder='Enter the title' style={{ width: "100%" }} />
                                        <br></br><br></br>
                                        <textarea name="Content" placeholder='Enter the Content' rows='10' style={{ width: "100%" }} className='my-auto' />
                                        <button type="submit" className='btn btn-primary mx-auto mt-4' >Add Component</button>

                                    </form>
                                </div>
                            </div>
                        </Modal.Body>

                    </Modal>
                    <div className='container'>
                        <div className='d-block'>
                            <h2 className='my-2 text-center'>About Us</h2>
                            {isAdmin && <button className='btn btn-primary mx-auto' onClick={() => setIsOpen(true)}>Add Components</button>}
                        </div>
                        {About && About != null && About != "" && About != [] ?
                        <div className='row'>

                            {About && About.map(about => {
                                console.log(isOdd);
                                return <CollegeAbouUSComp isAdmin={isAdmin} key={about._id} delAboutComp={delAboutComp}
                                    collegeId={collegeId} {...about} isOdd={((isOdd++) % 2)} />
                            })}

                        </div>
                        :
                        <h1 className='text-center ' style={{ height: "300px", color: "gray", marginTop: "150px" }}>No About Us</h1>
                    }
                    </div>
                
                
        </>

    );

}


export default CollegeAboutUs;