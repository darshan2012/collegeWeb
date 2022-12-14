import React, { useEffect, useState } from 'react';
import axios from 'axios';

// import { IconName } from "react-icons/bs";
import { useContext } from 'react';
import { FaComment } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart, AiOutlineLike, AiFillLike } from "react-icons/ai";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FaEdit, FaSave } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import { MdCancelPresentation } from 'react-icons/md';
import { ImCancelCircle } from "react-icons/im";
import { RiEditBoxFill } from "react-icons/ri";
import { FcApproval } from "react-icons/fc";
import { CollegeContext, headers } from './MainComponent';
import { Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import '../CSS/post.css';


function Post(props) {
    const {
        collegeId,
        name,
        _id,
        logo,
        url,
        likes,
        caption, city, IsUser,
        handlePostLike, deletePost,
        isAdmin
    } = props;
    async function checkIsLiked(_id) {

        // if(isLiked1.length>2)
        //     isLiked1.pop();

        const token = localStorage.getItem("JWTtoken")
        // console.log(token)
        axios.get(`http://localhost:4200/college/${collegeId}/posts/${_id}/isLiked`, {
            headers: { "Authorization": "Bearer " + token }
        })
            .then((res) => {
                // console.log(res.data)
                // isLiked.current=res.data;   
                setIsLiked(res.data);
                // console.log(isLiked1[0])
            }).catch((err) => { console.log(err); setIsLiked(false); })



    }

    // console.log(checkIsLiked);
    const { } = useContext(CollegeContext);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCnt, setLikeCnt] = useState(likes);
    const [newCaption, setNewCaption] = useState(caption);
    const [tempCaption, setTempCaption] = useState(caption);

    const [isUpdateClick, setUpdateClick] = useState(false);

    const [cancelClick, setCancelClick] = useState(false);


    useEffect(() => {

        setIsLiked(checkIsLiked(_id))
    }, [])
    function changeUpdateClick() {


        if (tempCaption !== newCaption) {
            // console.log(tempCaption)
            setNewCaption(tempCaption)
            console.log(newCaption)
            axios.put(`http://localhost:4200/college/${collegeId}/posts/${_id}`, {
                "caption": tempCaption
            }, { headers: headers })
                .catch((err) => console.log(err))
        }

    }
    function cancelUpdate() {
        setUpdateClick(false);
        setTempCaption(newCaption);
    }

    function changeLikeCnt() {
        // console.log(IsUser());

        handlePostLike(_id)
        setIsLiked(!isLiked)
    }
    function workNthiKrtu() {
        console.log("workNthiKrtu")
    }
    return (
        <div className='shadow mb-4'>
            <div className=' '>
                <div style={{ display: 'flex', width: "10" }} className='mx-0 row my-auto'>

                    <Link to={`/colleges/${collegeId}/collegehome`}  className="mt-2 col-2 ml-2"><img src={logo} className="  my-auto border border-rounded "
                        style={{ borderRadius: "100%", width: "100%", height: "65px", padding: 0 }} /></Link>

                    {/* <p style={{paddingLeft:70,paddingTop:10}} >Name</p> */}
                    <Link to={`/colleges/${collegeId}/collegehome`}  className='col-9 nav-link text-dark fs-5 '><p className='mb-1'><b>{name}</b><br></br>
                        {city}</p> </Link> 
                    {isAdmin && <span onClick={() => deletePost(_id)} className='col-1 mt-3 '><AiFillDelete size={30} cursor="pointer" className='' /></span>}
                </div>

                <div className='row mx-0'>
                    <img className='col-12' src={url} style={{ padding: 0, maxheight: '550px' }} width={"100%"}></img>
                </div>
                <div className='row mt-2 mx-0'>

                    <div width="120%" className='flex col-11'>
                        <b>{name}</b>
                        {
                            !isUpdateClick ? <p className='bound' >{tempCaption}</p> : <textarea class="form-control" rows="4"
                                value={tempCaption} 
                                onChange={(e) => setTempCaption(e.target.value)} width="100%" />
                        }
                    </div>
                    {isAdmin && <div className='col-1'>
                        <span
                            onClick={() => { setUpdateClick(!isUpdateClick); changeUpdateClick() }}>{!isUpdateClick ? <FaEdit size={25} cursor="pointer" className='hover-shadow'/> : <FaSave  size={25} cursor="pointer" className='hover-shadow '/>}</span>
                        {
                            isUpdateClick &&
                            <span className='' style={{ display: "block" }}
                                onClick={() => cancelUpdate()} ><MdCancelPresentation size={25} cursor="pointer" className='hover-shadow' /></span>
                        }
                    </div>}

                </div>
                <div clas className='like mx-0  row'>
                    {/* <div className="col-6"> */}
                    {/* <div className='d-flex border'> */}

                    <div
                        className=' ml-2 d-flex col-md-12'
                        style={{ justifyContent: "center", background: "white" }}
                        onClick={() => IsUser() ? changeLikeCnt() : workNthiKrtu()}
                    >
                        {console.log("Like :", isLiked)}
                        {!isLiked ? <BsHeart size={28} className="mt-2 " style={{cursor:'pointer', margin: 5}} /> :
                            <BsHeartFill size={28} className="mt-2" style={{ cursor:'pointer',margin: 5 }} />}
                        <p className='mt-2'><b>{likes}</b></p>
                    </div>
                </div>

                {/* </div> */}

                {/* </div> */}
                {/* <div className="col-6"> */}
                {/* <button className='d-flex ml-5 col-6' style={{justifyContent:"center",background:"white"}}>
                         <p className='mt-2 mx-auto'><b>Comment</b></p>
                
                    </button> */}
            </div>
        </div>

    );
}

export default Post;