import React from 'react';
import '../CSS/mainAbout.css';

function AboutUs(props) {
    return (
        <div className='gd pt-5 row'>
            <div className='text-center col-5 mx-auto'>
                <div className='rare-wind-gradient '>
                    <img height={60} width={200} src='https://res.cloudinary.com/dmkfgsff7/image/upload/v1647927035/CollegeWeb/logo33_jwxcqb.png' className="mt-5 mb-5 ms-auto" />

                    <h1>About CollegeWeb</h1>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum 
                    </p>
                    <h1>Vision</h1>
                    <p>Create the easy access of the college information</p>
                    <h1>Who are we?</h1>
                    <p>collegeWeb is the project of two student with the idea of providing college information</p>
                </div>
            </div>


        </div>
    );
}

export default AboutUs;