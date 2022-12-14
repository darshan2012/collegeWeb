import axios from 'axios';
import React, { useEffect, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { headers, token, url } from './MainComponent';
import { CollegeContext } from './MainComponent';

function SearchComp(props) {

    const {
        collegeId, created, Followed, user_id, handleDelete
    } = props;
    const [collegeName, setCollegeName] = useState();
    const [collegeCity, setCollegeCity] = useState();
    const [collegeState, setCollegeState] = useState();
    const [collegeLogo, setCollegeLogo] = useState();
    const [collegeFollowers, setCollegeFollowers] = useState();
    const [isFollow, setIsFollow] = useState();
    // const { collegeSet } = useContext(CollegeContext)
    useEffect(() => {

        axios.get(`${url}college/${collegeId}`)
            .then((res) => {
                // console.log("I am here")
                setCollegeName(res.data.name);
                setCollegeCity(res.data.city);
                setCollegeLogo(res.data.logo);
                setCollegeState(res.data.state);
                setCollegeFollowers(res.data.followers);

                if (Followed)
                    if (Followed.findIndex(college => college === collegeId) !== -1)
                        setIsFollow(false)
                    else
                        setIsFollow(true)


            }).catch((err) => alert(err))
    }, [])



    function handleFollow() {

        if (user_id) {
            axios.get(`${url}college/${collegeId}/follow`, {headers: {'Content-Type':'application/json',
            'Authorization': 'Bearer ' + token}})
                .then(res => {
                    console.log(res.data);
                    if (res.data.user.followedColleges.indexOf(collegeId) === -1)
                        setIsFollow(false)
                    else
                        setIsFollow(true)
                    setCollegeFollowers(res.data.college.followers);
                    // setUser(res.data.user);
                    // setCollege(res.data.college)
                })
                .catch(err => console.log(err))
        }
        // if (isFollow) {


        //     const formData = new FormData();
        //     formData.append('collegeId', collegeId)
        //     console.log(collegeId)
        //     axios.put(`${url}users/${user_id}/unfollow`, ({ "collegeId": collegeId }),{headers:headers})
        //         .then((res) => console.log(res.data))
        //         .catch((err) => console.log(err))

        //     setIsFollow(false)
        //     axios.put(`${url}college/${collegeId}`, ({ "followers": collegeFollowers - 1 }))
        //         .catch((err) => console.log(err))
        //     setCollegeFollowers(collegeFollowers - 1)

        // }
        // else {

        //     axios.post(`${url}users/${user_id}/follow`,
        //         { "collegeId": collegeId })
        //         .then((res) => console.log(res.data))
        //         .catch((err) => console.log(err))
        //     setIsFollow(true);
        //     axios.put(`${url}college/${collegeId}`, ({ "followers": collegeFollowers }))
        //         .catch((err) => console.log(err))
        //     setCollegeFollowers(collegeFollowers + 1)

        // }
        // axios.put(`${url}college/${collegeId}`, {
        //     headers: {
        //         'Authorization': 'Bearer ' + token
        //     }
        // }, ({ "collegeId": collegeId }),
        //     {
        //         "followers": collegeFollowers
        //     }
        // ).then((err) => console.log(err))
    }



    return (
        // <div className='container'>
        // <br></br>

        // <>{
        // collegeId &&



        <div className='row' style={{ cursor: "pointer" }} >
            {/* <Link onClick={() => {
                console.log("CollegeId : " + collegeId)
                collegeSet(collegeId)
            }} to='/college/collegehome'></Link> */}
            <Link className='nav-link  col-sm-10 col-9 d-flex' to={`/colleges/${collegeId}/`}>

                <div className='col-md-2 col-lg-1 col-3 ms-md-2' >
                    <img src={collegeLogo} className='borde mx-auto my-auto' style={{ borderRadius: "100%", width: "70px", height: "70px" }} />

                </div>
                <div className='text-dark fs-5 ms-lg-3 overflow-hidden' >

                    <b >{collegeName}</b>
                    <p>{collegeCity},{collegeState}</p>

                </div>
            </Link>
            {
                Followed &&
                <div className='col-md-2  col-1 mt-2'>
                    {!isFollow ? <button onClick={() => { handleFollow(collegeId) }}
                        className='btn  btn-md btn-primary'>Follow</button> :
                        <button onClick={() => { handleFollow(collegeId) }}
                            className='btn shadow-0 text-dark text-capitalize btn-md border border-2 '>Following</button>
                    }

                </div>
            }



            {
                created && <div className='col-2 mt-2 ms-auto '>
                    <button style={{ borderTop: 0 }} onClick={() => { handleDelete(collegeId) }}
                        className='btn btn-md btn-danger'>delete</button>

                </div>
            }
        </div >





    );
}


export default SearchComp;