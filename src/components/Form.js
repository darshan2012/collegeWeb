// import React from 'react';
// import {form} from '  '



// function Form(props) {
//     return (
//         <div>
            
//             <Form model="feedback" onSubmit={(values) => this.handleSubmit(values)}>
//                             <Row className="form-group">
//                                 <Label htmlFor="firstname" md={2}>First Name</Label>
//                                 <Col md={10}>
//                                     <Control.text model=".firstname" id="firstname" name="firstname"
//                                         placeholder="First Name"
//                                         className="form-control"
//                                         validators={{
//                                             required, minLength: minLength(3), maxLength: maxLength(15)
//                                         }}

//                                          />
//                                     <Errors
//                                         className="text-danger"
//                                         model=".firstname"
//                                         show="touched"
//                                         messages={{
//                                             required: 'Required',
//                                             minLength: 'Must be greater than 2 characters',
//                                             maxLength: 'Must be 15 characters or less'
//                                         }}
//                                      />
//                                 </Col>
//                             </Row>
//                             <Row className="form-group">
//                                 <Label htmlFor="lastname" md={2}>Last Name</Label>
//                                 <Col md={10}>
//                                     <Control.text model=".lastname" id="lastname" name="lastname"
//                                         placeholder="Last Name"
//                                         className="form-control"
//                                         validators={{
//                                             required, minLength: minLength(3), maxLength: maxLength(15)
//                                         }}
//                                          />
//                                     <Errors
//                                         className="text-danger"
//                                         model=".lastname"
//                                         show="touched"
//                                         messages={{
//                                             required: 'Required',
//                                             minLength: 'Must be greater than 2 characters',
//                                             maxLength: 'Must be 15 characters or less'
//                                         }}
//                                      />
//                                 </Col>
//                             </Row>
//                             <Row className="form-group">
//                                 <Label htmlFor="telnum" md={2}>Contact Tel.</Label>
//                                 <Col md={10}>
//                                     <Control.text model=".telnum" id="telnum" name="telnum"
//                                         placeholder="Tel. Number"
//                                         className="form-control"
//                                         validators={{
//                                             required, minLength: minLength(3), maxLength: maxLength(15), isNumber
//                                         }}
//                                          />
//                                     <Errors
//                                         className="text-danger"
//                                         model=".telnum"
//                                         show="touched"
//                                         messages={{
//                                             required: 'Required',
//                                             minLength: 'Must be greater than 2 numbers',
//                                             maxLength: 'Must be 15 numbers or less',
//                                             isNumber: 'Must be a number'
//                                         }}
//                                      />
//                                 </Col>
//                             </Row>
//                             <Row className="form-group">
//                                 <Label htmlFor="email" md={2}>Email</Label>
//                                 <Col md={10}>
//                                     <Control.text model=".email" id="email" name="email"
//                                         placeholder="Email"
//                                         className="form-control"
//                                         validators={{
//                                             required, validEmail
//                                         }}
//                                          />
//                                     <Errors
//                                         className="text-danger"
//                                         model=".email"
//                                         show="touched"
//                                         messages={{
//                                             required: 'Required',
//                                             validEmail: 'Invalid Email Address'
//                                         }}
//                                      />
//                                 </Col>
//                             </Row>
//                             <Row className="form-group">
//                                 <Col md={{size: 6, offset: 2}}>
//                                     <div className="form-check">
//                                         <Label check>
//                                             <Control.checkbox model=".agree" name="agree"
//                                                 className="form-check-input"
//                                                  /> {' '}
//                                                 <strong>May we contact you?</strong>
//                                         </Label>
//                                     </div>
//                                 </Col>
//                                 <Col md={{size: 3, offset: 1}}>
//                                     <Control.select model=".contactType" name="contactType"
//                                         className="form-control">
//                                         <option>Tel.</option>
//                                         <option>Email</option>
//                                     </Control.select>
//                                 </Col>
//                             </Row>
//                             <Row className="form-group">
//                                 <Label htmlFor="message" md={2}>Your Feedback</Label>
//                                 <Col md={10}>
//                                     <Control.textarea model=".message" id="message" name="message"
//                                         rows="12"
//                                         className="form-control" />
//                                 </Col>
//                             </Row>
//                             <Row className="form-group">
//                                 <Col md={{size:10, offset: 2}}>
//                                     <Button type="submit" color="primary">
//                                     Send Feedback
//                                     </Button>
//                                 </Col>
//                             </Row>
//                         </Form>
//         </div>
//     );
// }

// export default Form;