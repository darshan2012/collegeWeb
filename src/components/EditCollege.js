import * as yup from 'yup';
import { Formik } from "formik";
import { Col, Row, Form, Modal, Button } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';
import College from './College';
import { CollegeContext, headers, url } from './MainComponent';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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



function EditCollege() {


    

    const [collegeDetails, setCollegeDetails] = useState();
    const {collegeId} = useParams();

    const navigate = useNavigate()

    useEffect(() => {
        getCollege();
    },[])
    function getCollege() {
        axios.get(`${url}college/${collegeId}`)
            .then(res => {
                setCollegeDetails(res.data)
                setLogoUrl(res.data.logo)
            })
            .catch(err => console.log(err))
    }


    const uploadImage = (e) => {
        console.log(e.target.files[0]);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("upload_preset", "my-uploads");

        // formData.append("folder","newFolder");

        Axios.post("https://api.cloudinary.com/v1_1/dofftzsmf/image/upload", formData)
            .then((res) => {
                console.log(res);
                setLogoUrl(res.data.secure_url)
            })
            .catch((Err) => console.log(Err))

    }
    // const [isModelOpen, setModel] = useState(false);
    // const { addCollege } = useContext(CollegeContext)
    const [logoUrl, setLogoUrl] = useState("")

    console.log(collegeDetails)
    const editCollege = (college) => {
        axios.put(`${url}college/${collegeId}`, college, { headers: headers })
            .then(res => {
                // setCollegeDetails(res.data)
                navigate(`/colleges/${collegeId}/collegehome`);
                // window.history.pushState({},null,`http://localhost:3000/colleges/${res.data._id}/collegehome`);
                window.location.reload(false)
                // window.location.href = `/colleges/${collegeId}/collegehome`;
            })
            .catch(err => console.log(err))

    }
    return (
        <>
            {collegeDetails &&
                <div className='container'>



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
                            editCollege(data);
                            setLogoUrl("");
                        }}
                        initialValues={{
                            name: collegeDetails.name,
                            email: collegeDetails.email,
                            phoneNo: collegeDetails.phoneNo,
                            address: collegeDetails.address,
                            city: collegeDetails.city,
                            state: collegeDetails.state,
                            zip: collegeDetails.zip,
                            // logo: collegeDetails.logo
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
                                        isInvalid={errors.name && touched.name}
                                    />
                                    <Form.Control.Feedback type="invalid"  >{errors.name}</Form.Control.Feedback>
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
                                            isInvalid={errors.email && touched.email}
                                        />

                                        <Form.Control.Feedback type="invalid" >{errors.email}</Form.Control.Feedback>
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
                                            isInvalid={errors.phoneNo && touched.phoneNo}
                                        />

                                        <Form.Control.Feedback type="invalid" >
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
                                        isInvalid={errors.address && touched.address}
                                    />
                                    <Form.Control.Feedback type="invalid" >
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
                                            isInvalid={!!errors.city && touched.city}
                                        />

                                        <Form.Control.Feedback type="invalid" >
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
                                            isInvalid={!!errors.state && touched.state}
                                        />
                                        <Form.Control.Feedback type="invalid" >
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
                                            isInvalid={!!errors.zip && touched.zip}
                                        />

                                        <Form.Control.Feedback type="invalid" >
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
                                        onChange={e => { handleChange(e); uploadImage(e) }}
                                        isInvalid={!!errors.logo && touched.logo}
                                    />
                                    <Form.Control.Feedback type="invalid" >
                                        {errors.logo}
                                    </Form.Control.Feedback>
                                    {logoUrl ?
                                        <img height="300px" src={logoUrl} /> : null}
                                </Form.Group>

                                <Button type="submit" className='btn btn-success'>Save</Button>
                            </Form>
                        )}
                    </Formik>
                </div>}
        </>
    );
}

export default EditCollege;