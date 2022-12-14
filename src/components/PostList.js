import React, { useContext, useEffect, useRef, useState } from 'react';
import Post from './Post';
import { Button } from 'react-bootstrap';
import CreateCollege from './CreateCollege';
import CollegeNavBar from './CollegeNavBar';
import { headers,url,token } from './MainComponent';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const Axios = axios.create()



function PostList(props) {
    const {
        // collegeId,
        // name,
        // logo,
        // posts, 
        // city,
        isAdmin,
         User
    } = props;
    const {collegeId}=useParams();
    const [name,setName]=useState();
    const [logo,setLogo]=useState();
    const [city,setCity]=useState();
    const isLiked = useRef("");
    // console.log(collegeId)
   
    const [modalClick, setModalClick] = useState(false);
    const [posts, SetPost] = useState(null);

    useEffect(()=>{
        axios.get(`${url}college/${collegeId}`)
        .then((res)=>{
            setName(res.data.name);
            setLogo(res.data.logo);
            setCity(res.data.city);
            SetPost(res.data.posts);
        })
    },[])

    const [newPostImg, setNewPostImg] = useState("");
    const handleimgChange = (e) => {
        console.log(e.target.files[0]);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("upload_preset", "my-uploads");
        formData.append("API_SECRET", "N6vRi9M2b8Tfwsesw1CLLQzzeHA")
        // formData.append("folder","newFolder");

        Axios.post("https://api.cloudinary.com/v1_1/dofftzsmf/image/upload", formData)
            .then((res) => setNewPostImg(res.data.url))
            .catch((Err) => alert(Err))

    }
    const postSubmit = (e) => {
        e.preventDefault();
        const caption = e.target.elements.Caption.value;
        axios.post(`http://localhost:4200/college/${collegeId}/posts`, {
            "url": newPostImg,
            "caption": caption
        },{headers : { "Authorization": "Bearer " + token }})
            .then((res) => SetPost(res.data))
            .catch((err) => console.log(err))
        { console.log(newPostImg) }
        setModalClick(false);
        setNewPostImg(null);
        // window.location.reload(false);

    }
    function IsUser() {
        console.log(User)
        if (User)
            return true;
        return false;
    }

    function deletePost(postId) {

        axios.delete(`http://localhost:4200/college/${collegeId}/posts/${postId}`, {
        headers:  { "Authorization": "Bearer " + token }
        }).then((res) => { console.log(res.data);SetPost(res.data) })
            .catch((Err) => console.log(Err))

    }
    async function handlePostLike(postId) {
        // const token = localStorage.getItem("JWTtoken")
        console.log(token)
        const Post1 = [...posts];
        axios.get(`http://localhost:4200/college/${collegeId}/posts/${postId}/like`, {
            headers: { "Authorization": "Bearer " + token }
        })
            .then((res) => {

                // console.log(Post1[Post1.findIndex(post=>post._id==postId)].likes)

                Post1[Post1.findIndex(post => post._id == postId)].likes = res.data.likes = res.data.likes;
                SetPost(Post1);

                console.log(Post1[Post1.findIndex(post => post._id == postId)].likes)
            }).catch((err) => console.log(err))




    }

    return (
        <>
            {/* <CollegeNavBar /> */}
            
            <div className='container'>
                <br /><br />
                <div className="row">
                    <div className=" col-md-1 col-12 mb-5">

                        {isAdmin && <Button className='' onClick={() => setModalClick(true)}>
                            add Post
                        </Button>}
                        <Modal show={modalClick} onHide={() => setModalClick(false)}>
                            <Modal.Header closeButton >
                            </Modal.Header>
                            <Modal.Body>
                                <input type="file" onChange={(e) => handleimgChange(e)} required />
                                <img src={newPostImg} height="320px" width={"100%"} />

                                <form onSubmit={(e) => postSubmit(e)}>
                                    <br></br>
                                    <textarea name='Caption' placeholder='Enter the caption' style={{ width: "100%" }} rows={3} /><br></br><br></br>
                                    <button type='submit' className='btn btn-lg btn-primary' style={{ "justifyContent": "center", width: "100%" }}>Add Post</button>
                                </form>
                            </Modal.Body>
                        </Modal>
                    </div>
                    {posts && posts!=null && posts !="" && posts != []  ?
                    // <div className='col-12 col-md-7 col-lg-5 '>
                    <div className='col-11'>
                        {posts && posts.map(post => {

                            return <div  className='col-12 col-md-9 mx-auto col-lg-5' key={post._id}>
                                
                                <Post
                                isAdmin = {isAdmin}
                                collegeId={collegeId}
                                _id={post._id}
                                logo={logo} IsUser={IsUser}
                                name={name} handlePostLike={handlePostLike}
                                city={city} deletePost={deletePost} {...post} /><br></br></div>

                        }

                        )}
                    </div>
                     :
                     <h1 className='text-center ' style={{height:"300px",color:"gray", marginTop:"100px"}}>No Post</h1>
         }
                </div>
            </div>
           
        </>

    );
}

export default PostList;









