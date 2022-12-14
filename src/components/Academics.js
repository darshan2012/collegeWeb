import axios from 'axios';
import React, { useState } from 'react';
import { Input } from 'reactstrap';
import { url, headers } from './MainComponent';

const Axios = axios.create();

function Academics(props) {
    const { collegeId, delComp,
        id, courseDescription, fees, imageUrl, duration, courseName, isAdmin } = props;

    const [imgUrl, setImgUrl] = useState(imageUrl);
    const [title, setTitle] = useState(courseName);
    const [description, setDescription] = useState(courseDescription);
    const [fee, setFees] = useState(fees);
    // const [editClick,setEditClick]=useState(true);
    const [durations, setDuration] = useState(duration);
    const [isEditClick, setIsEditClick] = useState(false);

    const [Uploading, setUploading] = useState(false);
    const saveComp = () => {
        const academics = {
            courseName: title,
            courseDescription: description,
            fees: fee,
            imageUrl: imgUrl,
            duration: durations
        }
        axios.put(`${url}college/${collegeId}/academics/${id}`, academics, { headers: headers })
            .then(res => {
                console.log(res.data)
                setImgUrl(res.data.imageUrl);
                setDescription(res.data.courseDescription);
                setDuration(res.data.duration)
                // console.log(res.data[0].courseDescription);
                setFees(res.data.fees)
                setTitle(res.data.courseName)
                setIsEditClick(false)
            })
            .catch(err => console.log(err))
    }


    const goback = () => {
        setImgUrl(imageUrl);
        setDescription(courseDescription);
        setDuration(duration)
        setFees(fees)
        setTitle(courseName)
    }
    async function uploadFile(file) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file)
        formData.append("upload_preset", "kfm1ji7h")
        formData.append("folder", "/Academics")
        await Axios.post("https://api.cloudinary.com/v1_1/dmkfgsff7/image/upload", formData)
            .then(res => {
                setUploading(false);
                setImgUrl(res.data.secure_url);
                console.log(res)
                // console.log("Upload " + noticeUrl)

            })
            .catch(err => {
                console.log(err)
                setUploading(false);
            })
    }

    return (
        <div className='row mx-auto mt-5'>
            <div className='col-6'>
                {isEditClick ? <input type="file" onChange={(e) => uploadFile(e.target.files[0])} /> : ""}
                <img className='mx-auto' width={"90%"} height={"380px"}
                    src={imgUrl} />

            </div>
            <div className='col-5'>
                <div className='row'>
                    {!isEditClick ?
                        <h2 className='col-10'>{title}</h2>
                        :
                        <input style={{height:"40px"}} className='col-10' type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
                    }
                    {isAdmin?
                    <div className=' mx-auto col-2'>
                        {
                            !isEditClick ?
                                <button onClick={() => { setIsEditClick(true) }}
                                    className='btn btn-primary'>Edit</button>
                                :
                                <button onClick={() => { setIsEditClick(false); goback() }}
                                    className='btn btn-primary'>Cancel</button>
                        }
                        <>
                            {!isEditClick ?
                                <button onClick={() => delComp(id)}
                                    className='btn btn-danger mt-2'>Delete</button>
                                :
                                <button onClick={() => { saveComp(id) }}
                                    className='btn btn-success mt-2'>Save</button>
                            }
                        </>
                    </div>:""}
                </div>
                {!isEditClick ?
                    <div height={"290px"}>{description}
                    </div>
                    :
                    <textarea cols={40} value={description} onChange={(e) => setDescription(e.target.value)} rows={5} width="100%" type="text" />

                }

                <div className='row my-5 me-5 border'>
                    <span className='my-2 ms-2 col-6 row'>
                        <h4 className=' col-12'>Fees : </h4>
                        {
                            !isEditClick ? <>
                                <h4 className=''>{fee}</h4></>
                                :
                                <Input onChange={(e) => setFees(e.target.value)} value={fee} type="text" />
                        }

                    </span>
                    <div className='my-2 ms-2 col-6 row'>
                        <h4 className='col-12'>Duration: </h4>
                        {
                            !isEditClick ? <>
                                <h4>{durations} {duration==1?"Year":"Years"}</h4>
                            </> :
                                <Input onChange={(e) => setDuration(e.target.value)}
                                    type="number" min={1} max={7} value={durations} />
                        }      
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Academics;