import React, { useState, useContext, useEffect } from 'react';
import { Button, Container, Form, Modal, ModalBody } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import CollegeNavBar from './CollegeNavBar';
import NoticeBlock from './NoticeBlock';
import { CollegeContext } from './MainComponent';
import { url } from './MainComponent';
import { token } from './MainComponent';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Axios = axios.create();
function NoticeList({noticeList,isAdmin,isPin}) {
   

    const {collegeId} = useParams();
    const [notices, setNotices] = useState(noticeList);
    const [isModelOpen, setModel] = useState(false);
    const [Uploading, setUploading] = useState(false)
    const [noticeUrl, setNoticeUrl] = useState("");

    useEffect(() => {
        axios.get(url + "college/" + collegeId + "/notices")
            .then((res) => setNotices(res.data))
            .catch(err => console.log(err))
    }, [])
    const updatePin=async(collegeId,blockId,isPinned)=>{

        await axios.put(url + "college/" + collegeId + "/notices/" + blockId , 
        { "isPinned": isPinned }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => setNotices(res.data))
            .catch(err => console.log(err))
    }
    // console.log(token);
    const addNoticeBlock = async (event) => {
        // console.log(value);
        // const colleges = [...Colleges]
        // const index = colleges.findIndex(college => college.collegeId === collegeId)
        const newNotice = {
            noticeTitle: event.target.elements.noticeTitle.value,
            notice: [
                {
                    description: event.target.elements.description.value,
                    noticeLink: noticeUrl
                }
            ]
        };
        console.log(newNotice);
        // console.log(token);
        axios.post(url + "college/" + collegeId + "/notices", JSON.stringify(newNotice), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                // console.log(res)
                setNotices(res.data)
            })
            .catch(err => console.log(err))

        // colleges[index].notices = ([...colleges[index].notices, newNotice])
        // console.log(colleges);
        //     const Notice = [...NoticeD];
        //     const index = Notice.findIndex(notice => notice.id === id);
        //     Notice[index].notice = ([...NoticeD[index].notice, newNotice]);
        //     // console.log(index)
        // setCollege(colleges)
        setModel(false)
    }

    const deleteNoticeBlock = async (blockId) => {
        await axios.delete(url + "college/" + collegeId + "/notices/" + blockId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => setNotices(res.data))
            .catch(err => console.log(err))
    }

    const editNoticeBlock = async (blockId, title) => {

        await axios.put(url + "college/" + collegeId + "/notices/" + blockId, { "noticeTitle": title }, {
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
        
        <div className='container'>
            {isAdmin &&  !isPin &&<button onClick={() => setModel(true)} className='btn btn-primary'>Add NoticeBlock</button>}
            {notices != undefined &&notices!="" && notices ?
            
            <Container className='row'>
               {!isPin? notices.map(notice => {
                    // console.log(notice,notice._id);
                    return <div key={notice._id} className='col-lg-4 col-md-6 col-12 mt-5' >
                        <NoticeBlock 
                            blockId={notice._id}
                            editNoticeBlock={editNoticeBlock}
                            deleteNoticeBlock={deleteNoticeBlock}
                            collegeId={collegeId} 
                            setNotices={setNotices}
                            isAdmin={isAdmin}
                            isPinned={notice.isPinned}
                            updatePin={updatePin}
                            {...notice} />
                    </div>
                })
                :
                notices.map(notice => {
                    // console.log(notice,notice._id);
                    if(notice.isPinned)
                    {
                    return <div key={notice._id} className='col-lg-4 col-md-6 col-12 mt-5' >
                        <NoticeBlock 
                            blockId={notice._id}
                            editNoticeBlock={editNoticeBlock}
                            deleteNoticeBlock={deleteNoticeBlock}
                            collegeId={collegeId} 
                            setNotices={setNotices}
                            isAdmin={isAdmin}
                            isPinned={notice.isPinned}
                            {...notice} />
                    </div>
                    }
                })
                }
                
                
            </Container> 
            :
                <h1 className='text-center ' style={{height:"300px",color:"gray", marginTop:"200px"}}>No Notices</h1>
            }
            <Modal show={isModelOpen} onHide={() => { setModel(false) }}>
                <Modal.Header className='fs-1 fw-bolder' closeButton>
                    Add Notice
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => { e.preventDefault(); addNoticeBlock(e) }} >
                        <Form.Group>
                            <Form.Control type="text" name="noticeTitle" placeholder="Enter Notice Title" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='mt-3 fs-3 fw-bold'>Notice</Form.Label>
                            <Form.Control type="text" name="description" placeholder='Enter notice description' />
                            <br />
                            <Form.Control type="file" name="noticeLink" onChange={(e) => uploadNotice(e.target.files[0])} />
                                {Uploading?<p>uploding... </p>: ""}
                      
                        </Form.Group>
                        <Button type='submit'>submit</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            
        </div>
    );
}

 
// const Notices = [
//     {
//         id: uuidv4(),
//         noticeTitle: "Important Notice",
//         notice: [{
//             id: uuidv4(),
//             description: 'This is the imageFile ',
//             noticeLink: "https://picsum.photos/500/300?img=1",
//         },
//         {
//             id: uuidv4(),
//             description: 'This is the imageFile ',
//             noticeLink: "https://picsum.photos/500/300?img=1",
//         },

//         {
//             id: uuidv4(),
//             description: 'This is the pdf file',
//             noticeLink: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//         }
//         ]

//     },
//     {
//         id: uuidv4(),
//         noticeTitle: "Important Notice",
//         notice: [
//             {
//                 id: uuidv4(),
//                 description: 'This is the imageFile which you have to click',
//                 noticeLink: "https://picsum.photos/500/300?img=1",
//             },
//             {
//                 id: uuidv4(),
//                 description: 'This is the pdf file',
//                 noticeLink: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//             }
//         ]

//     },
// ]

export default NoticeList;