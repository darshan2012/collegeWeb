import React, { useEffect, useState } from 'react';
import CollegeNavBar from './CollegeNavBar';
import ImageSlider from './ImageSlider';
import PostList from './PostList';
import NoticeList from './NoticeList';
import CollegeAboutUs from './CollegeAboutUs';
import CollegeContactus from './CollegeContactus';
import { Routes, Route, BrowserRouter,Outlet, useParams } from 'react-router-dom';
 import CollegeCategory from './CollegeCategory';
 import axios from 'axios';
 import {url} from './MainComponent';




function College({isAdmin}) {
    // const {
       
    useEffect(() => {
        axios.get(url + "college/" + collegeId + "/notices")
            .then((res) => setNotices(res.data))
            .catch(err => console.log(err))
    },[])
    const [notices,setNotices] = useState()
    // } = props
    const {collegeId} = useParams();
    console.log(collegeId)
    // console.log("cooooo",college)
    return (
        
        <div key={window.location.pathname}>
            {/* <div className='bg-dark'><CollegeNavBar /></div> */}
        
            {/* <CollegeNavBar user={user!==undefined?user:undefined} collegeId={college._id} college={college}/>
            <Outlet /> */}
            {/* <BrowserRouter>
                <Routes>
                    <Route exact path='/CollegeHome/Aboutus' element={<CollegeAboutUs />} ></Route>
                    <Route exact path='/CollegeHome/Contactus' element={<CollegeContactus />}></Route>
                    <Route exact path='/CollegeHome/Posts' element={<PostList />}></Route>
                    <Route exact path='/CollegeHome/Notices' element={<NoticeList />}></Route>
                </Routes>

            </BrowserRouter> */}
            
            {/* {console.log(college.collegeId + college.id)} */}
            <ImageSlider isAdmin={isAdmin} collegeId={collegeId} />
            
            <NoticeList isPin={true} isAdmin={isAdmin} />
            {/* <PostList />
            <CollegeContactus />
            <CollegeAboutUs /> */}
            
            {/* <CollegeCategory /> */}
        </div>
    );
}

export default College;