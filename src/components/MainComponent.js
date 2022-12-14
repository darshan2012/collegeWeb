import React, { useEffect, useState,  } from 'react';
import { Button } from 'react-bootstrap';
import { BrowserRouter, Route, Routes, useNavigate,Outlet } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
// import { useNavigate } from 'react-router'



import AboutUs from './AboutUs';
import College from './College';
import CollegeAboutUs from './CollegeAboutUs';
import CollegeContactus from './CollegeContactus';
import ContactUs from './ContactUs';
import HomeComponent from './HomeComponent';
import MainNavbar from './MainNavbar';
import NoticeList from './NoticeList';
import PostList from './PostList';
import Search from './Search';
import UserLogin from './login';
import CollegeCategory from './CollegeCategory';
import CollegeNavBar from './CollegeNavBar';
import SignUp from './SignUp';
import CollegeList from './CollegeList';
import Userlog from './User';
import EditCollege from './EditCollege';
import AcademicsList from './AcademicsList';

const axios = require('axios');
export const CollegeContext = React.createContext()

export const url = "http://localhost:4200/";



export const token = localStorage.getItem("JWTtoken");
export const headers = {'Content-Type':'application/json',
'Authorization': 'Bearer ' + token}
var variable;


function MainComponent(props) {

    // const navigate = useNavigate()

    const [Colleges, setCollege] = useState(null)
    const [User, setUser] = useState(null)
    const [isLogin,setlogin] = useState(false)
    const [isAdmin, setAdmin] = useState();
    const [reload,setReload] = useState(false);
    // const navigate = useNavigate()
    useEffect( () => {
        // await axios.get(`${url}college`)
        // .then((res)=>setCollege(res.data)
        // .catch((err)=>err)
        
        if(token) {
            // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`  
            // console.log(token)
            fetch(`${url}users/checkJWTtoken`, {
                method: "get",
                headers: {'Content-Type':'application/json',
                          'Authorization': 'Bearer ' + token},
            })
            .then(res => res.json())
            .then(res => {
                // console.log(res)
                setUser(res.user)      
            })    
        }
    },[])
    
    
    // function collegeSet(collegeId) {
        
    //     axios.get(`${url}college/${collegeId}`,{headers:headers})
    //                 .then(res => 
    //                     {
    //                         console.log(res.data)
                            
    //                         setCollege(res.data)
                        
                        
    //                     {<Navigate to='/college/collegehome'/>}
                        
    //                 }   
    //                 )   
    //                 // .then(() => {console.log(Colleges)
                        
    //                 .catch(err => console.log(err))
    //                 window.location.href = '/college/collegehome'

                        
    // }
    




//     function addAbout(id,About){

//         const tempCollege=[...Colleges];
//         const index=Colleges.findIndex(temp=>temp.collegeId===id);
//         tempCollege[index].aboutUS=([...Colleges[index].aboutUS,About]);
//         setCollege(tempCollege);
//     }

//     function editAbout(collegeId,aboutId,description,title){
//         //,title:title
// axios.put(`http://localhost:4200/college/${collegeId}/about/${aboutId}`,{description:description,title:title})
// .then((res)=>console.log(res.data.json)).catch((err)=>console.log(err))
// }


//     function delAboutComp(collegeId,aboutId)
//     {
//         axios.delete(`http://localhost:4200/college/${collegeId}/about/${aboutId}`)
//         .then((res)=>{console.log(res.data.json);window.location.reload(false)})
//         .catch((Err)=>console.log(Err))
//     }



   

    const collegeContextValue = {
        // isFollow,
        // handleFollow,
        // addAbout,
        // editAbout,
        // delAboutComp,
        setAdmin,
        setUser,
        // addCollege,
        setReload
    }

    // function collegeDetails() {
    //     if(!Colleges)
    //         return undefined;
    //     else
    //     {
    //         return ({
    //             _id: Colleges._id,
    //             name:Colleges.name,
    //             email:Colleges.email, 
    //             phoneNo:Colleges.phoneNo,
    //             address:Colleges.address,
    //             city:Colleges.city,
    //             state:Colleges.state,
    //             zip:Colleges.zip,
    //             followers:Colleges.followers,
    //             logo:Colleges.logo
    //         })
    //     }   
    // }

    const NavLayout = () => (
        <>
          <MainNavbar user={User?User:undefined}/>
          <Outlet />
        </>
      );


    return (
        <CollegeContext.Provider value={collegeContextValue}>
            <div>    
                <BrowserRouter>
                {!isLogin?
                    <MainNavbar user={User?User:undefined}/>:null
                }
                    <Routes>
                        
                        <Route path='/' element={<HomeComponent setUser={setUser} isAdmin={isAdmin}
                             User={User?User._id:undefined} />}> </Route>
                        
                        <Route path='/login'  element={<UserLogin  setlogin={setlogin} setUser={setUser}/>}> </Route>

                        {/* <Route  path='/signup' element={<Userlog setlogin={setlogin} setUser={setUser}/>} /> */}

                        <Route exact path='/signup'  element={<SignUp setlogin={setlogin} setUser={setUser}/>}> </Route>

                        <Route  path='/aboutus' element={<AboutUs />}></Route>
                        
                        <Route  path='/contactus' element={<ContactUs />}></Route>

                        <Route  path='/colleges' element={<CollegeList />} ></Route>
                        
                        <Route exact path='/colleges/:collegeId' element={<CollegeNavBar reload={reload} isAdmin={isAdmin} user={User?User:undefined} />} >
                            
                            <Route exact path='/colleges/:collegeId/collegehome'
                            element={<College isAdmin={isAdmin} />} />
                            
                            <Route exact path='/colleges/:collegeId/about' element={<CollegeAboutUs isAdmin={isAdmin} />} /> 
                            
                            <Route exact path='/colleges/:collegeId/posts' element={<PostList isAdmin={isAdmin}
                             User={User?User._id:undefined} />}></Route>
                            
                            <Route exact path='/colleges/:collegeId/notices' element={<NoticeList isAdmin={isAdmin}
                             />}></Route>

                            <Route exact path='/colleges/:collegeId/academics' element={<AcademicsList isAdmin={isAdmin}
                             />}></Route>
                            
                            <Route exact path='/colleges/:collegeId/contact' element={<CollegeContactus isAdmin={isAdmin}
                            />}></Route>

                            <Route exact path='/colleges/:collegeId/editCollege' element={<EditCollege
                            />}></Route>
                            
                        </Route>
                        
                        

                       
                        

                        <Route exact path='/collegehome/search' element={<Search />}></Route>
                        
                    </Routes>
                </BrowserRouter> 
                
                {/* <Button onClick={handleclick}>Click</Button> */}
            </div>
        </CollegeContext.Provider>

    );
}

export default MainComponent;



// const CollegeList = [
//     {
//         name: 'K S School of information technology',
//         email: 'ks@gmail.com',
//         phoneNo: '3234332',
//         address: 'gujarat university, navrangpura',
//         city: 'Ahmedabad',
//         state: 'Gujarat',
//         zip: '132323',
//         followers: "22",
//         logo: "https://picsum.photos/500/300?img=1",
//         imageList: [
//             {  url: "https://picsum.photos/500/300?img=1" },
//             {  url: "https://picsum.photos/500/300?img=2" },
//             {  url: "https://picsum.photos/500/300?img=3" },
//             {  url: "https://picsum.photos/500/300?img=4" },
//             {  url: "https://picsum.photos/500/300?img=5" },
//             {  url: "https://picsum.photos/500/300?img=6" }
//         ],
//         posts: [
//             {
//                 imageUrl: "https://picsum.photos/500/300?img=2",
//                 isLiked: false,
//                 likeCnt: 5,
//             },
//             {
//                 imageUrl: "https://picsum.photos/500/300?img=4",
//                 isLiked: false,
//                 likeCnt: 5,
//             }
//         ],
//         notices: [
//             {
//                 noticeTitle: "Important Notice",
//                 notice: [{
                   
//                     description: 'This is the imageFile ',
//                     noticeLink: "https://picsum.photos/500/300?img=1",
//                 },
//                 {
                    
//                     description: 'This is the imageFile ',
//                     noticeLink: "https://picsum.photos/500/300?img=1",
//                 },

//                 {
                   
//                     description: 'This is the pdf file',
//                     noticeLink: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//                 }
//                 ]

//             }
//         ],

//         aboutUs: [
//             {
//                 imageUrl: 'https://picsum.photos/500/300?img=3',
//                 title: "Campus",
//                 description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//             },
//             {
//                 imageUrl: 'https://picsum.photos/500/300?img=1',
//                 title: "Placement",
//                 description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//             }
//         ]
//     }
// ]
