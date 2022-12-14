import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { CollegeContext, headers } from './MainComponent';
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { AiFillCodeSandboxCircle, AiFillDelete } from "react-icons/ai";
import { ImCancelCircle } from "react-icons/im";
import { RiEditBoxFill } from "react-icons/ri";
const { innerWidth: width, innerHeight: height } = window;

const Axios = axios.create();

function CollegeAbouUSComp(props) {
    const {
        collegeId,
        _id, imageUrl, title, description, isOdd, delAboutComp,isAdmin
    } = props;
    const { } = useContext(CollegeContext);
    const [editClick, setEditClick] = useState(false);
    const [cancelClick, setCancelClick] = useState(false);

    const [aboutDescription, setAboutDescription] = useState(description);
    const [aboutTitle, setAboutTitle] = useState(title);
    const [editAboutTitle, setEditAboutTitle] = useState(title);
    const [editAboutDescription, setEditAboutDescription] = useState(description);

    const [editImg, setEditImg] = useState(imageUrl);
    const [aboutImg, setAboutImg] = useState(imageUrl);

    // function delAboutComp()
    // {
    //     axios.delete(`http://localhost:4200/college/${collegeId}/about/${_id}`)
    //     .then((res)=>{console.log(res.data.json);window.location.reload(false)})
    //     .catch((Err)=>console.log(Err))
    // }

    const changeAboutImg = async (file) => {

        const formData = new FormData();

        formData.append("file", file);
        formData.append("upload_preset", "my-uploads");
        formData.append("API_SECRET", "N6vRi9M2b8Tfwsesw1CLLQzzeHA");


        Axios.post("https://api.cloudinary.com/v1_1/dofftzsmf/image/upload", formData)
            .then((res) => {

                setEditImg(res.data.url);
                console.log(res.data.url);
            }).catch((Err) => console.log(Err))
    }

    function changeEditClick() {
        setEditClick(editClick => !editClick);
        setCancelClick(!cancelClick);
        if (editClick) {
            console.log("Here 0");
            if (aboutDescription !== editAboutDescription) {
               
                
                axios.put(`http://localhost:4200/college/${collegeId}/about/${_id}`,
                    { description: editAboutDescription},{headers:headers})
                    .then((res) =>  setAboutDescription(editAboutDescription)).catch((err) => console.log(err))
            }

            if (aboutTitle !== editAboutTitle) {
                axios.put(`http://localhost:4200/college/${collegeId}/about/${_id}`,
                    {title: editAboutTitle },{headers:headers})
                    .then((res) => setAboutTitle(editAboutTitle)).catch((err) => console.log(err))
            }
            //editAbout(collegeId, _id, aboutDescription, aboutTitle);
            if (editImg !== aboutImg) {
                
                
                axios.put(`http://localhost:4200/college/${collegeId}/about/${_id}`, { imageUrl: editImg },{headers:headers})
                    .then((res) => {
                        setAboutImg(editImg)
                    }).catch((err) => console.log(err))
            }
            // editAboutImg(collegeId, _id, aboutImg);
            console.log("Here 2");
        }
    }
    function handleCancel() {
        setEditClick(!editClick)
        setCancelClick(!cancelClick);
        if (cancelClick) {
            setEditAboutDescription(aboutDescription);
            setEditAboutTitle(aboutTitle);
            setEditImg(aboutImg);

        }
    }

    return (
        // id:uuid(),
        // imageUrl:"https://picsum.photos/500/300?img=1",
        // title:"Campus",
        // description
        <>

            {console.log(collegeId, _id)}
            {/* <button className='btn btn-primary mx-auto' onClick={()=>deleteAbout(collegeId,id)}>Delete Components</button> */}

            {isOdd || width <= 720 ?
                <><div className='col-10 col-md-6 mx-auto mt-5 ml-2'>
                    {editClick && <input type="file" onChange={(event) => { changeAboutImg(event.target.files[0]) }} />}
                    <img src={editImg} className='mx-auto' width={"90%"} height={"380px"} />
                </div>
                    <div className='  col-md-5 col-10 mt-5 mx-md-auto'>
                        <h2 className='mx-auto'>
                            {!editClick ? <>{aboutTitle}</> :
                                <input type="text" value={editAboutTitle} onChange={(event) => setEditAboutTitle(event.target.value)} />}</h2>
                        {!editClick ? <>{aboutDescription}{console.log(editClick)}
                        </> : <textarea onChange={(event) => setEditAboutDescription(event.target.value)} style={{ width: "100%", height: "300px" }} value={editAboutDescription} />}
                    </div>
                    {isAdmin && <div className='col-1 col-md-1 mx-auto mt-5'>
                        {/* onClick={setEditClick(!editClick)} */}
                        <button onClick={changeEditClick} className='btn '>{!editClick ? <><RiEditBoxFill /></> : <FaSave />}</button>
                        <button className='btn' onClick={!editClick ? () => delAboutComp(_id) : () => handleCancel()}>{!editClick ? <AiFillDelete /> : <ImCancelCircle />}</button>
                    </div>}
                </>
                :
                <>
                    <div className='col-md-4 col-10 mt-5 mx-auto ml-2'>
                        <h2 className='mx-auto'>
                            {!editClick ? <>{aboutTitle}</> :
                                <input type="text" value={editAboutTitle} onChange={(event) => setEditAboutTitle(event.target.value)} />}</h2>
                        {!editClick ? <>{aboutDescription}{console.log(editClick)}
                        </> : <textarea onChange={(event) => setEditAboutDescription(event.target.value)} style={{ width: "100%", height: "300px" }} value={editAboutDescription} />}
                    </div>

                    {isAdmin && <div className='col-2 col-md-2 mx-auto mt-5'>
                        <button onClick={changeEditClick} className='btn '>{!editClick ? <><RiEditBoxFill /></> : <FaSave />}</button>
                        <button className='btn' onClick={!editClick ? () => delAboutComp(_id) : () => handleCancel()}>{!editClick ? <AiFillDelete /> : <ImCancelCircle />}</button>
                    </div>}

                    <div className='col-12 col-md-6 mx-auto mt-5'>
                        {editClick && <input type="file" onChange={(event) => { changeAboutImg(event.target.files[0]) }} />}
                        <img src={editImg} className='mx-auto' width={"90%"} height={"380px"} />
                    </div>
                </>
            }


        </>
    );
}

export default CollegeAbouUSComp;