import React, { useState, useEffect, useContext, useRef } from 'react';
import { Carousel, InputGroup } from 'react-bootstrap';
import { CollegeContext } from './MainComponent';
import axios from 'axios';
import { headers, url } from './MainComponent';
import { Modal } from 'react-bootstrap';
import SliderImage from './SliderImage';
import Image from './Image';
import { Button } from 'react-bootstrap';
import { Input } from 'reactstrap';
import '../CSS/imageSlider.css';

const Axios = axios.create();


function ImageSlider(props) {
    const {
        collegeId,
        isAdmin
    } = props

    const fileRef = useRef(null);
    const [imageList, setSlider] = useState([]);
    const [isModalOpen, setModal] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [show, setShow] = useState();
    

    async function fetchData() {
        await axios.get(`${url}college/${collegeId}/SliderImage`)
            .then((res) => setSlider(res.data))
            .catch(err => console.log(err))
    }

    useEffect(() => {
        fetchData();
    }, [])

    const AddImage = async (file) => {
        // setImageUrl(await uploadImage(file))
        // const imgUrl = uploadImage(file)
        uploadImage(file, (imgUrl, err) => {
            if (err) {
                alert('only images can be used as slider Image')
            }
            else {
                axios.post(`${url}college/${collegeId}/SliderImage`, {
                    "url": imgUrl
                }, { headers: headers })
                    .then(res => {
                        setSlider(res.data)
                        setImageUrl("");
                        setModal(false)
                    })
                    .catch(err => console.log(err))
            }

        })

    }

    const uploadImage = (file, cb) => {
        // console.log(file)
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "kfm1ji7h")
        formData.append("folder", "/SliderImages")
        Axios.post("https://api.cloudinary.com/v1_1/dmkfgsff7/image/upload", formData)
            .then(res => {
                cb(res.data.secure_url, null)
            })
            .catch(err => { console.log(err); return cb(null, err) })
    }

    async function deleteImage(id) {
        axios.delete(`${url}college/${collegeId}/SliderImage/${id}`,{headers:headers})
            .then(res => setSlider(res.data))
            .catch(err => console.log(err))
    }

    async function editImage(id, file) {
        uploadImage(file, (imgUrl, err) => {
            if (err) {
                alert(err)
            }
            else {
                axios.put(`${url}college/${collegeId}/SliderImage/${id}`, { "url": imgUrl }, { headers: headers })
                    .then(res => setSlider(res.data))
                    .catch(err => console.log(err))
            }

        })

    }
    return (
        <>
            {isAdmin && <Button onClick={() => setShow(show => !show)}>Image</Button>}
            {show ?
                <div className='mx-5 row '>
                    Image Slider Setting
                    <input type="file" ref={fileRef} hidden onChange={(e) => AddImage(e.target.files[0])} />
                            <Button onClick={() => fileRef.current.click()}>Add New Image</Button>
                    {
                        imageList && imageList != undefined && imageList != [] && imageList != "" ?
                            imageList.map(image => {
                                return (
                                    <div key={image._id} className=' col-3' >
                                        <Image image={image.url} id={image._id}
                                            deleteImage={deleteImage}
                                            editImage={editImage}
                                            uploadImage={uploadImage}
                                        />

                                    </div>
                                )
                            })
                            :
                            <>
                                <div>
                                <h1 className='text-center ' style={{ height: "300px", color: "gray", marginTop: "150px" }}>No Images</h1>
                                </div>
                            </>
                    }
                </div>
                :
                <>
                    {/* {isAdmin && <Button onClick={() => setModal(true)}>Add</Button>} */}

                    <Modal className='row my-modal' backdrop='static' show={isModalOpen} onHide={() => { setModal(false) }}>
                        <Modal.Header className='col-12 border-dark  bg-light  modalHeader' closeButton>
                            <p className='fs-2 m-0 p-0 '>
                                Image Slider
                            </p>
                        </Modal.Header>
                        <Modal.Body className='col-12 bg-light modalBody'>
                            {/* <Input type='file' onChange={(e) => uploadImage(e.target.files[0])} /> */}
                            <input type="file" ref={fileRef} hidden onChange={(e) => AddImage(e.target.files[0])} />
                            <Button onClick={() => fileRef.current.click()}>Add New Image</Button>
                            {imageUrl ? <img height='300px' width='200px' src={imageUrl} ></img> : ""}
                            {
                                imageList && imageList != undefined && imageList != [] && imageList != "" ?
                                    imageList.map(image => {
                                        return (
                                            <div key={image._id} className='mt-5' >
                                                <SliderImage image={image.url} id={image._id}
                                                    deleteImage={deleteImage}
                                                    editImage={editImage}
                                                    uploadImage={uploadImage}
                                                />
                                            </div>
                                        )
                                    })
                                    :
                                    <>
                                        <div>
                                        <h1 className='text-center ' style={{ height: "300px", color: "gray", marginTop: "150px" }}>No About Us</h1>
                                        </div>
                                    </>
                            }

                        </Modal.Body>
                    </Modal>

                    {imageList && imageList != [] && imageList != "" ?
                        <>


                            <Carousel>
                                {imageList.map(image => {
                                    return (
                                        <Carousel.Item key={image._id}>
                                            <img
                                                height="500px"
                                                width="100%"
                                                className="d-block"
                                                src={image.url}
                                                alt="First slide"
                                            >
                                            </img>
                                            {/* <button onClick={() => deleteImage(image._id)}>delete</button> */}
                                        </Carousel.Item>)
                                })}
                            </Carousel>



                        </> : <div >
                            <p>
                                
                            </p>
                            <img height="500px" />
                        </div>}
                </>


            }
        </>
    );
}

export default ImageSlider;