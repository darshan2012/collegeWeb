import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Form, Modal, ModalBody } from 'react-bootstrap';
import axios from 'axios';
import { headers, url } from './MainComponent';
import Academics from './Academics';

const AcademicsList = ({isAdmin}) => {
    const [Course, setCourse] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [newImg, setNewImg] = useState("");
    const { collegeId } = useParams();
    const [imgErr, setImgErr] = useState("");
    const [titleErr, setTitleErr] = useState("");
    const [feeErr, setFeeErr] = useState("");
    const [descriptionErr, setDescriptionErr] = useState("");
    const [durationErr, setDurationErr] = useState("");
    useEffect(() => {
        // console.log(url + "college/" + collegeId + "/academics")
        axios.get(url + "college/" + collegeId + "/academics")
            .then((res) => {
                setCourse(res.data);
            }).catch((err) => {
                console.log(err);
            })
    }, [])
    const delComp = (id) => {

        axios.delete(`${url}college/${collegeId}/academics/${id}`)
            .then((res) => {
                setCourse(res.data);
            }).catch((err) => console.log(err))
    }
    const checkData = (Name, Desc, fees, imageUrl, duration, cb) => {
        checkTItle(Name)
        checkFees(fees);
        checkDescription(Desc);
        checkDuration(duration);
        checkImg(imageUrl)
        if(titleErr || descriptionErr || feeErr || durationErr || imgErr)
        cb(true)
        else
        cb(false)
    }
    const checkTItle = (val) => {
        if (val == "" || val == null)
            setTitleErr("Course Name is required");
        else
            setTitleErr("");
    }
    const checkFees = (val) => {
        const regex = new RegExp(/[^0-9]/, 'g');
        if (val === "" )
            setFeeErr("Fee is required");
        else if (isNaN(val))
            setFeeErr("Fee is not a number");
        else
            setFeeErr("");
    }
    const checkDescription = (val) => {
        if (val == "" || val == null)
            setDescriptionErr("Course description is required");
        else
            setDescriptionErr("")
    }
    const checkDuration = (val) => {
        if (val == "" || val == null)
            setDurationErr("Course duration is required");
        else
            setDurationErr("")
    }
    const checkImg = (val) => {
        if (val == "" || val == null)
            setImgErr("image is required");
        else
            setImgErr("")
    }
    const addCourse = (e) => {
        e.preventDefault();
        const Name = e.target.elements.Name.value;
        const Desc = e.target.elements.Content.value;
        const fees = e.target.elements.fees.value;
        const imageUrl = newImg;
        const duration = e.target.elements.duration.value;
        checkData(Name, Desc, fees, imageUrl, duration, (err) => {
            if (!err) {

                axios.post(`${url}college/${collegeId}/academics`,
                    {
                        "courseName": Name,
                        "courseDescription": Desc,
                        "fees": fees,
                        "imageUrl": imageUrl,
                        "duration": duration,
                    })
                    .then((res) => {
                        setCourse(res.data);
                        setNewImg("")
                    }).catch((Err) => console.log(Err))
                setIsOpen(false);
            }
        })

    }
    // const 
    const changeNewImage = (e) => {
        const formData = new FormData()
        formData.append("file", e.target.files[0])
        formData.append("upload_preset", "my-uploads")
        formData.append("API_SECRET", "N6vRi9M2b8Tfwsesw1CLLQzzeHA");
        axios.post("https://api.cloudinary.com/v1_1/dofftzsmf/image/upload", formData)
            .then((res) => {
                setNewImg(res.data.url);
                setImgErr("");
                // console.log(res.data.url);
            }).catch((Err) => { console.log(Err); setImgErr("Invalid format") })
    }
    return (<>
        <Modal show={isOpen} 
        onHide={() => 
        { setIsOpen(false);
            setTitleErr("")
            setDescriptionErr("")
            setDurationErr("")
            setFeeErr("")
            setImgErr("")
            setNewImg("")
            
         }} 
         width="500px">
            <Modal.Header closeButton >
                Upload About
            </Modal.Header>
            <Modal.Body>
                <div className='row'>
                    <div className='col-6'>
                        <input type='file'
                            onChange={(event) => changeNewImage(event)} />
                        <img src={newImg} className='mt-3' height="85%" width="100%" />
                        <p className='text-danger'>{imgErr != "" || imgErr ? imgErr : ""}</p>
                    </div>
                    <div className='col-6'>
                        <Form onSubmit={(e) => addCourse(e)}>

                            <input type="text" name="Name"
                                placeholder='Enter the Course Name'
                                onChange={(e) => {
                                    if (titleErr != "" || titleErr != null)
                                        checkTItle(e.target.value);
                                }}
                                style={{ width: "100%" }} />
                            <p className='text-danger'>{titleErr != "" || titleErr ? titleErr : ""}</p>
                            <br></br><br></br>
                            <textarea name="Content"
                                onChange={(e) => {
                                    if (descriptionErr != "" || descriptionErr != null)
                                        checkDescription(e.target.value);
                                }}
                                placeholder='Enter the Description' rows='8' style={{ width: "100%" }} className='my-auto' />
                            <p className='text-danger'>{descriptionErr != "" || descriptionErr ? descriptionErr : ""}</p>
                            <div className='row'>
                                <input type='text'
                                    className='col-4 mx-auto mt-2'
                                    onChange={(e) => {
                                        if (feeErr != "" || feeErr != null)
                                            checkFees(e.target.value);
                                    }}
                                    height={"90px"}
                                    name='fees'
                                    placeholder='fees'
                                />
                                <p className='text-danger'>{feeErr != "" || feeErr ? feeErr : ""}</p>
                                <input type='number'
                                    max={7}
                                    min={1}
                                    onChange={(e) => {
                                        if (durationErr != "" || durationErr != null)
                                            checkDuration(e.target.value);
                                    }}
                                    className='col-4 mx-auto'
                                    name='duration'
                                    placeholder='duration'
                                />
                                <p className='text-danger'>{durationErr != "" || durationErr ? durationErr : ""}</p>
                            </div>
                            
                            <button type="submit" className='btn btn-primary mx-auto mt-4' >Add Component</button>
                                
                            
                        </Form>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
        <h2 className='text-center mt-3'>Our Courses</h2>
        <div className='row'>
            <div className='col-2'>
            {isAdmin?<button onClick={() => setIsOpen(true)}
                    className='btn btn-lg'>Add Course</button>
                    :""}
            </div>
            {
                Course && Course.map(course => {
                    return <Academics isAdmin={isAdmin} collegeId={collegeId}
                        id={course._id}
                        delComp={delComp}
                        {...course} />
                })
            }

        </div>
    </>
    );
};

export default AcademicsList;