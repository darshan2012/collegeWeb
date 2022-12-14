import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Navbar, Nav, Container, Modal } from 'react-bootstrap';
import { Link, Outlet, useParams, NavLink, useNavigate, useLocation } from 'react-router-dom';
import ImageSlider from 'react-simple-image-slider';
import UserLogin from './login';
import { CollegeContext, headers, url } from './MainComponent';

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@500&family=Roboto:ital,wght@1,900&display=swap');
</style>

function CollegeNavBar({ user, isAdmin }) {

    const { collegeId } = useParams();
    const [College, setCollege] = useState(null);
    const [Clicked, setClicked] = useState(true);
    const navigate = useNavigate();
    const [loginModal, setLoginModal] = useState("");

    useEffect(() => {
        // console.log("AKJNS");
        getCollege();
        checkAdmin()
        isFollow()
        navigate(`/colleges/${collegeId}/collegehome`)
    }, [collegeId])

    useEffect(() => {
        console.log("UseEffect " + Clicked)
        // console.log(user !== undefined &&  user.followedColleges.findIndex(college=>college._id === college._id) !== -1);
        isFollow()
    }, [user])



    async function handleFollow(Id) {


        // console.log("I am here")
        if (user != null) {

            axios.get(`${url}college/${collegeId}/follow`, { headers: headers })
                .then(res => {
                    console.log(res.data);
                    setUser(res.data.user);
                    setCollege(res.data.college)
                })
                .catch(err => console.log(err))
        }
        else {
            setLoginModal(true);
        }
    }

    function checkAdmin() {
        axios.get(`${url}college/${collegeId}/isadmin`, { headers: headers })
            .then(res => {
                // console.log(res.data);
                setAdmin(res.data)
            })
            .catch(err => console.log(err))
    }

    async function getCollege() {
        axios.get(`${url}college/${collegeId}`)
            .then(res => setCollege(res.data))
            .catch(err => console.log(err))
    }

    async function isFollow() {
        // console.log(await user.followedColleges.findIndex(college=>college._id === Id) === -1);

        if (user !== undefined) {

            if (user.followedColleges.indexOf(collegeId) !== -1)
                setClicked(false)
            else
                setClicked(true)
            console.log("IS FOLLOW :" + Clicked)
        }

        // console.log(Clicked)
    }


    const { setUser, setAdmin } = useContext(CollegeContext)



    // console.log(Clicked)
    return (

        <>
            {College &&
                <Navbar className='row'>
                    <Link className='col-2 ms-5' to={`/colleges/${collegeId}/collegehome`}><img height={70} width={70} src={College.logo} className="  "
                    /></Link>


                    <Nav className='col-7 row'>
                        <Link className='col-12 navbar-brand text-bold ' to={`/colleges/${collegeId}/collegehome`} ><p className='fs-3 mx-auto'>{College.name}</p> </Link>
                        <Navbar.Collapse className='col-12' id="responsive-navbar-nav">
                        <Nav className="mx-auto" style={{"font-family": 'Roboto'}}>
                                    <Link className='nav-link' to={`/colleges/${collegeId}/collegehome`} ><b className='collegeNav'>Home</b></Link>
                                    <Link className='nav-link' to={`/colleges/${collegeId}/about`}><b>About</b></Link>
                                    <Link className='nav-link' to={`/colleges/${collegeId}/academics`}><b> Academics </b></Link>
                                    <Link className='nav-link' to={`/colleges/${collegeId}/notices`}><b>Notice</b></Link>
                                    <Link className='nav-link' to={`/colleges/${collegeId}/posts`}><b>Post</b></Link>
                                    <Link className='nav-link' to={`/colleges/${collegeId}/contact`}><b>Contact</b></Link>
                                </Nav>
                            {/* <Nav className="mx-auto">
                            
                                <Link className='nav-link' to={`/colleges/${collegeId}/collegehome`} >Home</Link>
                                <Link className='nav-link' to={`/colleges/${collegeId}/about`}>About</Link>
                                <Link className='nav-link' to={`/colleges/${collegeId}/academics`}>Academics</Link>
                                <Link className='nav-link' to={`/colleges/${collegeId}/notices`}>Notice</Link>
                                <Link className='nav-link' to={`/colleges/${collegeId}/posts`}>Post</Link>
                                <Link className='nav-link' to={`/colleges/${collegeId}/contact`}>Contact</Link>
                            </Nav> */}
                        </Navbar.Collapse>
                    </Nav>

                    <Nav className='ms-auto me-5 col-1 row'>
                        {isAdmin ?
                            <Link className='navbar-brand  text-bold badge btn btn-secondary text-light'
                                to={`/colleges/${collegeId}/editCollege`} >Edit College </Link>
                            :
                            <div>
                                {user === undefined || Clicked ? <button onClick={() => {

                                    handleFollow(College._id);
                                }} className='badge btn btn-lg shadow-0 bg-primary text-wrap ms-lg-3 ms-sm-0 ms-2 '>
                                    Follow
                                </button>
                                    :
                                    <button
                                        onClick={() => { handleFollow(College._id); }}
                                        className=' badge text-dark border border-2 shadow-0 text-wrap ms-3'>
                                        Following
                                    </button>}</div>
                        }
                        <Navbar.Brand className='fs-5 ms-5 fw-bold col-12' >{College.followers}</Navbar.Brand>
                    </Nav>
                </Navbar>

            }
            <>
                <Modal show={loginModal} onHide={() => { setLoginModal(false) }}  >
                    <Modal.Header closeButton>

                    </Modal.Header>
                    <Modal.Body>
                        <UserLogin isModal={true} setUser={setUser} />
                    </Modal.Body>

                </Modal>
            </>
            <Outlet />
        </>



        // <div >



        //     {College &&
        //         <div>
        //             <Navbar>
        //                 <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        //                 <Container className='row'>
        //                     <Link className='col-2 ' to={`/colleges/${collegeId}/collegehome`}><img height={70} width={70} src={College.logo} className="  "
        //                     /></Link>

        //                     <Nav className='me-5 col-6 row'>
        //                         <Link className='col-12 navbar-brand text-bold' to={`/colleges/${collegeId}/collegehome`} ><p className=''>{College.name}</p> </Link>



        //                         <Navbar.Collapse className='col-12' id="responsive-navbar-nav">

        //                             <Nav className="">
        //                                 <Link className='nav-link' to={`/colleges/${collegeId}/collegehome`} >Home</Link>
        //                                 <Link className='nav-link' to={`/colleges/${collegeId}/about`}>About</Link>
        //                                 <Link className='nav-link' to={`/colleges/${collegeId}/notices`}>Notice</Link>
        //                                 <Link className='nav-link' to={`/colleges/${collegeId}/posts`}>Post</Link>
        //                                 <Link className='nav-link' to={`/colleges/${collegeId}/contact`}>Contact</Link>
        //                             </Nav>
        //                         </Navbar.Collapse>
        //                     </Nav>


        //                     <Nav className='col-3 row'>
        //                         {isAdmin ?
        //                             <Link className='navbar-brand  text-bold badge btn btn-secondary text-light'
        //                                 to={`/colleges/${collegeId}/editCollege`} >Edit College </Link>
        //                             :
        //                             <div>
        //                                 {user === undefined || Clicked ? <button onClick={() => {

        //                                     handleFollow(College._id);
        //                                 }} className='badge btn btn-lg shadow-0 bg-primary text-wrap ms-lg-3 ms-sm-0 ms-2 '>
        //                                     Follow
        //                                 </button>
        //                                     :
        //                                     <button
        //                                         onClick={() => { handleFollow(College._id); }}
        //                                         className=' badge text-dark border border-2 shadow-0 text-wrap ms-3'>
        //                                         Following
        //                                     </button>}</div>
        //                         }
        //                         <Navbar.Brand className='fs-5 ms-5 fw-bold col-12' >{College.followers}</Navbar.Brand>
        //                     </Nav>



        //                 </Container>
        //             </Navbar>

        //             {/* <Navbar bg="light" variant="light">
        //                 <Container>







        //                 </Container>

        //             </Navbar> */}

        //             
        //         </div>
        //     }

        //     {/* <ImageSlider isAdmin={isAdmin} collegeId={collegeId} /> */}
        // </div >

    );
}

export default CollegeNavBar;