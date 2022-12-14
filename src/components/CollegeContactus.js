import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CollegeNavBar from './CollegeNavBar';
import { CollegeContext, url } from './MainComponent';




/*
name: 'College Name',
        email: 'ads@asd.asd',
        phoneNo: '3234332',
        address: 'zcdvd',
        city: 'sdv',
        state: 'sdfv',*/
function CollegeContactus({isAdmin}) {
    
// const{
//     name,email,phoneno,address,city,state
// }=contactDetails;

    // const collegeInfo = {
    //     Name: name,
    //     Address: address,
    //     City: city,
    //     State: state,
    //     Country: "India",
    //     PhoneNo: phoneno,
    //     Email: email,
    //     Image: "https://picsum.photos/500/300?img=6"
    // }
    // console.log(contactDetails)
    const {collegeId} = useParams();
    const [college, setInfo] = useState();
    useEffect(() => {
        axios.get(`${url}college/${collegeId}`)
        .then(res => setInfo(res.data))
        .catch(err => console.log(err))
    },[])
    // console.log(collegeDetails())
    return (
        <>
            {college &&
            
            <div className='container '>
                <h2 className='text-center mb-5'>Contact Us</h2>

                <div className='row'>
                    <div className='  mx-auto col-12 col-md-6 mx-auto mt-5 ml-2'>
                        <img  height="450px" width="100%"></img>
                    </div>
                    <div className=' col-md-5 col-12 mt-5 ms-auto'>
                        <div>
                            <h3>
                                {college.name}
                            </h3>
                        </div>
                        <div className=' mt-3'>

                            
                        <div > {college.address} </div>
                        <div > {college.city} </div>
                        <div > {college.zip} </div>
                        <div > {college.state} </div>
                        <div > {college.email} </div>
                        <div > {college.phoneNo} </div>
                            {/* {Object.entries(college).map(([key, value]) => {
                                // console.log(key)
                                if (key === "address" || key === "email" || key === "phoneNo"
                                     || key === "city" || key === "state" || key === "zip")
                                    return (

                                        <div > {college[key]} </div>
                                    )
                            })} */}
                        </div>
                    </div>
                </div>
            </div>}
        </>

    );
}

export default CollegeContactus;