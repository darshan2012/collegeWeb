import React, { useState } from "react";
import '../CSS/contact.css'
import emailjs from 'emailjs-com' 

const ContactUs = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    message: "",
  });

  let name, value;
  const postUserData = (event) => {
    name = event.target.name;
    value = event.target.value;

    setUserData({ ...userData, [name]: value });
  };

  // connect with firebase
  function submitData(e) {
    console.log(e.target.firstName.value)
    e.preventDefault();
    emailjs.sendForm('service_2c45013',
    'template_an7s2t6',
    e.target,
    'm33PjXRbAPP5zkHcY')
    .then((res)=>{
      console.log(res)
    }).catch((err)=>{
      console.log((err))
    })
  };

  return (
    <div >
      <section className="contactus-section">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-10 mx-auto">
              <div className="row">
                <div className="contact-leftside col-12 col-lg-5">
                  <h1 className="main-heading fw-bold">
                    Connect With Our <br />  Team.
                  </h1>
                  <figure>
                    <img
                      src="https://res.cloudinary.com/dofftzsmf/image/upload/v1650180586/Vectors/contact_qmyc8y.jpg"
                      alt="contatUsImg"
                      className="img-fluid mt-1 ms-0"
                    />
                  </figure>
                </div>

                {/* right side contact form  */}
                <div className="contact-rightside col-12 col-lg-7">
                  <form onSubmit={(e)=>submitData(e)}>
                    <div className="row">
                      <div className="col-12  contact-input-feild">
                        <input
                          type="text"
                          name="firstName"
                          id=""
                          className="form-control"
                          placeholder="First Name"
                          value={userData.firstName}
                          onChange={postUserData}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12  contact-input-feild">
                        <input
                          type="text"
                          name="email"
                          id=""
                          className="form-control"
                          placeholder="Email ID"
                          value={userData.email}
                          onChange={postUserData}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 ">
                        <textarea
                          rows={40}
                          
                          name="message"
                          id=""
                          className="form-textarea"
                          placeholder="Enter Your Message"
                          value={userData.message}
                          onChange={postUserData}
                        />
                      </div>
                    </div>
                   

                    <button
                      type="submit"
                      className="mt-5 btn btn-style w-100">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;