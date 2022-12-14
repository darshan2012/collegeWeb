import * as yup from 'yup';
import { Formik } from "formik";
import { Col, Row, Form, Modal, Button } from 'react-bootstrap';
import { useState, useContext } from 'react';
import College from './College';
import { CollegeContext, headers, url } from './MainComponent';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserLogin from './login';
 
const Axios = axios.create();

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const zipRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
// const SUPPORTED_FORMATS = ["images/jpg", "images/jpeg", "images/png"];
const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().required().email(),
    phoneNo: yup.string().required().matches(phoneRegExp, 'Phone number is not valid'),
    address: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.string().required().matches(zipRegExp, 'zip is not valid'),
    // logo: yup.mixed()
    //     .test('FILE_FORMAT', 'Unsupported File Format',
    //         (value) => {
    //             return (value && value.match(/.(jpg|jpeg|png|PNG|JPEG|JPG)$/))
    //         }
    //     )
});

function CreateCollege({isUser,setUser}) {


    
    const [loginModal, setLoginModal] = useState("");

    const uploadImage = (e) => {
        console.log(e.target.files[0]);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("upload_preset", "my-uploads");
        
        // formData.append("folder","newFolder");

        Axios.post("https://api.cloudinary.com/v1_1/dofftzsmf/image/upload", formData)
            .then((res) => {
                console.log(res);
                setLogoUrl(res.data.secure_url)})
            .catch((Err) => console.log(Err))

    }
    const [isModelOpen, setModel] = useState(false);
    // const { addCollege } = useContext(CollegeContext)
    
    const [logoUrl, setLogoUrl] = useState("")
    const navigate = useNavigate()
   
    console.log("User: ",isUser)

    const addCollege = (newCollege) => {
        // newCollege.collegeId = uuidv4();
        newCollege.followers = 0;
        newCollege.imageList = [];
        newCollege.posts = [];
        newCollege.notices = [];
        newCollege.aboutUS = [];
        console.log(newCollege);
        

        axios.post(`${url}college`,newCollege,{headers:headers})
        .then(res => {
            // setCollege(prevColleges => {
            //         return(
            //              [ ...prevColleges, res.data ])
            //         })
            console.log(res.data)
            navigate(`/colleges/${res.data._id}/`);
            
        })
        .catch(err => {
            console.log(err)
        })
    }

    
    return (
        <>
            <Button onClick={() => {
                if(isUser)
                    setModel(true)
                else
                    setLoginModal(true)
            }}
                className='btn btn-lg mx-auto'
                style={{ height: "50px", width: "300px" }}
            >
                + Create College
            </Button>
            <Modal show={isModelOpen}
            
                backdrop="static"
                onHide={() => { setModel(false) }}>
                <Modal.Header
                    closeButton>
                    Create College
                </Modal.Header>
                <Modal.Body>
                    <Formik
                    
                        validationSchema={schema}
                        // onSubmit=  {(values) => {
                        //     setModel(false)
                        //     alert(JSON.stringify(values, null, 2))}}
                        onSubmit={(values, actions) => {
                            // actions.setSubmitting(false);
                            const data = values;
                            console.log(data);
                            data.logo = logoUrl;
                            // alert(JSON.stringify(values, null, 2))
                            actions.resetForm();
                            addCollege(data);
                            setLogoUrl("");
                            setModel(false);
                          }}
                        initialValues={{
                            name: '',
                            email: '',
                            phoneNo: '',
                            address: '',
                            city: '',
                            state: '',
                            zip: '',
                            logo: null
                        }}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            values,
                            touched,
                            isValid,
                            errors,
                        }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group
                                    as={Col}
                                    controlId="validationFormik101"
                                    className="position-relative"
                                >
                                    <Form.Label>College Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        placeholder='Enter College Name'
                                        value={values.name}
                                        onChange={handleChange}
                                        isInvalid={errors.name&&touched.name}
                                    />
                                    <Form.Control.Feedback type="invalid" className='position-relative mt-0' >{errors.name}</Form.Control.Feedback>
                                </Form.Group>
                                <Row className="mb-3">



                                    <Form.Group
                                        as={Col}
                                        controlId="validationFormik102"
                                        className="position-relative"
                                    >
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder='Enter Email'
                                            value={values.email}
                                            onChange={handleChange}
                                            isInvalid={errors.email&&touched.email}
                                        />

                                        <Form.Control.Feedback type="invalid" className='position-relative'>{errors.email}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group
                                        as={Col}
                                        controlId="validationFormik105"
                                        className="position-relative"
                                    >
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Phone Number"
                                            name="phoneNo"
                                            maxLength="10"
                                            value={values.phoneNo}
                                            onChange={handleChange}
                                            isInvalid={errors.phoneNo&&touched.phoneNo}
                                        />

                                            <Form.Control.Feedback className='position-relative' type="invalid" >
                                            {errors.phoneNo}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>

                                <Form.Group className="my-3"
                                    controlId="formGridAddress1">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control placeholder="1234 Main St"
                                        type='text'
                                        name='address'
                                        value={values.address}
                                        onChange={handleChange}
                                        isInvalid={errors.address&&touched.address} 
                                        />
                                    <Form.Control.Feedback type="invalid" className='position-relative'>
                                        {errors.address}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Row className="mb-3">
                                    <Form.Group
                                        as={Col}
                                        controlId="validationFormik103"
                                        className="position-relative"
                                    >
                                        <Form.Label>City</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="City"
                                            name="city"
                                            value={values.city}
                                            onChange={handleChange}
                                            isInvalid={!!errors.city&&touched.city}
                                        />

                                        <Form.Control.Feedback className='position-relative' type="invalid" >
                                            {errors.city}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group
                                        as={Col}
                                        controlId="validationFormik104"
                                        className="position-relative"
                                    >
                                        <Form.Label>State</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="State"
                                            name="state"
                                            value={values.state}
                                            onChange={handleChange}
                                            isInvalid={!!errors.state&&touched.state}
                                        />
                                        <Form.Control.Feedback className='position-relative' type="invalid" >
                                            {errors.state}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group
                                        as={Col}
                                        controlId="validationFormik105"
                                        className="position-relative"
                                    >
                                        <Form.Label>Zip</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Zip"
                                            name="zip"
                                            maxLength="6"
                                            value={values.zip}
                                            onChange={handleChange}
                                            isInvalid={!!errors.zip&&touched.zip}
                                        />
                                
                                        <Form.Control.Feedback className='position-relative' type="invalid" >
                                            {errors.zip}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Form.Group className="position-relative mb-3">
                                    <Form.Label>Logo</Form.Label>
                                    <Form.Control
                                        type="file"
                                        required
                                        name="logo"
                                        // value={logoUrl}
                                        onChange={e => {handleChange(e);uploadImage(e)}}
                                        isInvalid={!!errors.logo&&touched.logo}
                                    />
                                    <Form.Control.Feedback className='position-relative' type="invalid" >
                                        {errors.logo}
                                    </Form.Control.Feedback>
                                    {logoUrl?
                                    <img  style={{maxHeight:"300px",maxWidth:"100%"}}  src={logoUrl}/>:null}
                                </Form.Group>

                                <Button type="submit">Submit form</Button>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>

            <Modal show={loginModal} onHide={() => { setLoginModal(false) }}  >
                <Modal.Header closeButton>
                                    
                </Modal.Header>
                <Modal.Body>
               <UserLogin isModal={true} setUser={setUser}/>
                </Modal.Body>
                    
                </Modal>

        </>
    );
}

export default CreateCollege;