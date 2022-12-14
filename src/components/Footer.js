
import React from 'react';
import { MDBFooter } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import '../CSS/footer.css';

const Footer = () => {
    return (
        <MDBFooter bgColor='dark' className='block text-center  text-lg-start text-muted'>

            <section className=''>
                <div className='container text-center text-md-start mt-5'>
                    <div className='row mt-3'>
                        <div className='col-md-3 col-lg-4 col-xl-3 mx-auto mb-4'>
                            <h6 className='text-uppercase  fw-bold '>
                                <i className='fas fa-gem me-3'></i>                            
                                <img height={80} width={100} src='https://res.cloudinary.com/dofftzsmf/image/upload/v1646578435/CollegeWeb_logo/logo2_iggth9.png'
                        />
                            </h6>
                            <p className='text-light'>
                                Get the information regarding the colleges.Create the college and provide information.
                            </p>
                        </div>

                        <div className='mt-4 col-md-2 col-lg-2 col-xl-2 mx-auto mb-4'>
                            <h6 className=' text-uppercase fw-bold mb-4 text-light'>Links</h6>
                            <p>
                                <Link to='/' className='text-light'>
                                    Home
                                </Link>
                            </p>
                            <p>
                                <Link to='/colleges' className='text-light'>
                                    colleges
                                </Link>
                            </p>
                            <p>
                                <Link to='/contactus' className='text-light'>
                                    Contact Us
                                </Link>
                            </p>
                            <p>
                                <Link to='/aboutus' className='text-light'>
                                    About Us
                                </Link>
                            </p>
                        </div>

                       

                        <div className='mt-4 text-light col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4 text-light'>Contact</h6>
                            <p>
                                <i className='fas fa-envelope me-3 text-light'></i>
                                collegeWeb@gmail.com
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className='text-center p-4 bg-grey' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                © 2022 Copyright:
                <a className='text-reset fw-bold' href='/'>
                    CollegeWeb.com
                </a>
            </div>
        </MDBFooter>
    );
}

export default Footer;