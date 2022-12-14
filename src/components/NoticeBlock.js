import { wait } from '@testing-library/user-event/dist/utils';
import React, { useState, useContext } from 'react';
import { Card, Form, Modal, Button } from 'react-bootstrap';
import { BsPinAngle,BsPinAngleFill } from "react-icons/bs";
import { AiOutlineHeart, AiFillHeart, AiOutlineLike, AiFillLike } from "react-icons/ai";

// import { MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardLink, MDBListGroup, MDBListGroupItem, MDBCardHeader } from 'mdb-react-ui-kit';
// import { CollegeContext } from './MainComponent';
import { url } from './MainComponent';
import { token } from './MainComponent';
import Notice from './Notice';
const axios = require('axios');
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@500&family=Roboto:ital,wght@1,900&display=swap');
</style>
const Axios = axios.create();


function NoticeBlock(props) {
    const {
        setNotices,
        collegeId,
        blockId,
        noticeTitle,
        notice,
        editNoticeBlock,
        deleteNoticeBlock,
        isAdmin,
        isPinned,
        
    } = props

    // const [block, setBlock] = useState(props.notice)
    // console.log(block);
    const [isNoticeModelOpen, setNoticeModel] = useState(false);
    const [noticeUrl, setNoticeUrl] = useState("")
    const [isTitleOpen, setTitleOpen] = useState(false)
    const [title, setTitle] = useState(noticeTitle);
    const [pinned,setPin]=useState(isPinned);

    const [Uploading, setUploading] = useState(false)

    const updatePin=async()=>{

        console.log(pinned);
        await axios.put(url + "college/" + collegeId + "/notices/" + blockId , 
        { "isPinned": pinned }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res =>{ setNotices(res.data);
                setPin(!pinned);
                console.log(res.data.isPinned);
            })
            .catch(err => console.log(err))
    }

    // console.log(notice.description);
    const addNotice = async (event) => {
        
        console.log(noticeUrl)
        const newNotice = {
            description: event.target.elements.description.value,
            noticeLink: noticeUrl
        }
        
        axios.post(url + "college/" + collegeId + "/notices/" + blockId + "/notice/", newNotice, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => setNotices(res.data))
            .catch(err => console.log(err))
        setNoticeModel(false)


    }


    const editNotice = async (noticeId, data) => {

        console.log(data);
        await axios.put(url + "college/" + collegeId + "/notices/" + blockId + "/notice/" + noticeId, { "description": data }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => setNotices(res.data))
            .catch(err => console.log(err))
    }

    const deleteNotice = (noticeId) => {
        axios.delete(url + "college/" + collegeId + "/notices/" + blockId + "/notice/" + noticeId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => setNotices(res.data))
            .catch(err => console.log(err))
    }


    async function uploadNotice(file) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file)
        formData.append("upload_preset", "kfm1ji7h")
        formData.append("folder", "/Notice")
        await Axios.post("https://api.cloudinary.com/v1_1/dmkfgsff7/upload", formData)
            .then(res => {
                setUploading(false);
                setNoticeUrl(res.data.secure_url);
                console.log(res)
                // console.log("Upload " + noticeUrl)
                
            })
            .catch(err => {
                console.log(err)
                setUploading(false);
            })
    }
    return (
        // <Card>
        <>
            <Card style={{ height: "350px" }} className='shadow-5' >
                <Card.Header  style={{backgroundColor:"#cacfcc"}}>
                    <Card.Title>

                        {isTitleOpen ?
                            <span >
                                <Form onSubmit={(e) => {
                                    e.preventDefault();
                                    setTitleOpen(false);
                                    editNoticeBlock(blockId, title)
                                }
                                }>
                                    <input type="text" value={title} name="title" onChange={(e) => setTitle(e.target.value)} />
                                    <button type='submit' className='ms-5 ms-md-3 ms-lg-3 badge btn btn-lg btn-success'>
                                        save
                                    </button>
                                    <button onClick={() => { setTitle(noticeTitle); setTitleOpen(false) }} className='ms-1 badge btn btn-lg btn-dark'>
                                        cancel
                                    </button>
                                </Form>

                            </span>
                            :
                            <div className='row'>
                                <span className='col mt-2' style={{"font-family": 'Roboto'}} >
                                    <b className='my-auto mt-2'>{noticeTitle}</b>
                                </span>

                               {isAdmin&&<> 
                                <>
                                {pinned ?
                                 <BsPinAngleFill onClick={()=>updatePin()}
                                   style={{"cursor":"pointer"}} className='ms-auto col-lg-2 col-md-3 col-2 my-auto'>
                                 Pinned
                             </BsPinAngleFill>   : 
                             <BsPinAngle
                             style={{"cursor":"pointer"}} onClick={()=>updatePin()} className='ms-auto col-lg-2 col-md-3 col-2 my-auto '>
                             Pin
                         </BsPinAngle>  
                            } 
                            </><button onClick={() => setTitleOpen(true)} className='ms-auto col-lg-2 col-md-3 col-2 my-auto btn-sm badge btn  btn-secondary'>
                                    Edit
                                </button>
                                
                                <button onClick={() => { deleteNoticeBlock(blockId) }} className='ms-1 col-lg-2 col-md-3 col-2 btn-sm my-auto badge btn  btn-danger'>
                                    Delete
                                </button></>}
                            </div>
                        }
                    </Card.Title>
                </Card.Header>
                <Card.Body className='overflow-auto'>
                    {notice?.map(doc =>
<>
                        <Notice  isAdmin={isAdmin} editNotice={editNotice} deleteNotice={deleteNotice} key={doc._id} {...doc} /><br></br>
</>
                    )}
                </Card.Body>

                {isAdmin && <button onClick={() => setNoticeModel(true)} className='btn btn-lg'>Add Notice</button>}
                <Modal backdrop="static" show={isNoticeModelOpen} onHide={() => { setNoticeUrl(""); setNoticeModel(false) }}>
                    <Modal.Header closeButton>
                        Add Notice
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={async (e) => {
                            e.preventDefault();
                            !Uploading?
                            addNotice(e):console.log(Uploading)

                        }} >
                            <div>
                                <Form.Control type="text" name="description" placeholder='Enter notice description' />
                                <br />
                                <input type="file" name="noticeLink" onChange={(e) => uploadNotice(e.target.files[0])} />
                                {Uploading?<p>uploding... </p>: ""}
                            </div>
                            <Button className='mt-4' type='submit'>submit</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Card>

        </>
        // </Card>
    );
}

export default NoticeBlock;