import React from 'react';
import { Container, Col, Row, Modal, Button, Image, Form, Alert, Spinner } from 'react-bootstrap';
import firebase from "firebase";
import { withRouter } from "react-router-dom";
import Stepper from "react-stepper-horizontal";

import '../../assets/styles.css';
import Avatar from '../../assets/avatar_placeholder.png';

class EmailForm extends React.Component {
    
    state = {
        email: "",
        isFormValidated: false,
        isEmailValid: false,
        isLoading: false,

        firebaseError: "",
    };

    // Helper Functions

    checkValidEmail = () => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email));

    redirectToSignup = () => this.props.history.push('/signup');

    findUser = async () => {

        return await firebase
            .firestore()
            .collection('users')
            .doc(this.state.email)
            .get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {
                    return true;
                } else {
                    return false;
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({ firebaseError: "A server error occurred. Please wait a bit and try again" });
            })
    }

    onChange = (e) => {
        this.setState({ email : e.target.value, });
    };

    onEmailSubmit = async (e) => {

        e.preventDefault();
        e.stopPropagation();

        // Clear error and update states
        this.setState({ firebaseError: "", isLoading : true, isFormValidated : true});

        // Check for email validity
        if (!this.checkValidEmail()) {
            this.setState({ isEmailValid: false, isLoading : false })
            return;
        }
        else {
            this.setState({ isEmailValid: true })
        }

        // Check database for user
        let isValidUser = await this.findUser();

        // Update States and callback
        if (isValidUser) {
            this.setState({ isFormValidated: false,  isLoading : false })
            this.props.emailFound(this.state.email);
        }
        else {
            this.setState({ isLoading : false })
        }
    }

    render() {

        // Form Styles
        let emailStyle = {
            value: this.state.email,
            type: "email",
            required: true,
            onChange: this.onChange,
            placeholder: "Enter Email",
        };

        let invalidStyle = {
            isInvalid: true,
        };

        return <Modal.Dialog centered>
            <Modal.Header>
                <Col>
                    <Row className="modal-title">
                        <Image height="60rem" roundedCircle src={Avatar} />
                    </Row>
                    <Row className="modal-title">
                        <Modal.Title>User Login</Modal.Title>
                    </Row>
  
                    <Row>
                    <Stepper steps={[
                        {title: 'Enter Email'}, 
                        {title: 'Enter Password'}, 
                        {title: 'Success!'} ]} 
                        activeStep={ 0 }
                        lineMarginOffset = { 1 }
                        circleTop = { 20 }
                        circleFontSize = { 18 }
                        size = { 45 }
                        />
                    </Row>
                </Col>
            </Modal.Header>

            <Modal.Body>
                <Container>

                    {/* Email Form */}
                    <Form
                        onSubmit={e => this.onEmailSubmit(e)}
                        > <Form.Group controlId="email">
                            <Form.Label>Email address</Form.Label>
                            {this.state.isFormValidated && !this.state.isLoading
                                ? <Form.Control
                                    {...emailStyle}
                                    {...invalidStyle}
                                />
                                : <Form.Control
                                    {...emailStyle}
                                />
                            }
                            {this.state.isFormValidated
                                ? (!this.state.isEmailValid)
                                    ? <Form.Control.Feedback type="invalid"> Please Enter a Valid Email </Form.Control.Feedback>
                                    : <Form.Control.Feedback type="invalid">  User Not Found </Form.Control.Feedback>
                                : null
                            }
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                    {/* Firebase Error Display*/}
                    {this.state.firebaseError
                        ? <Alert variant="danger">
                            {this.state.firebaseError}
                        </Alert> 
                        : null
                    }

                    {/* Submit Button */}
                    {this.state.isLoading
                        ? <Button variant="info" disabled type="submit" block>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    /> Loading...
                        </Button>
                        : <Button variant="info" type="submit" block>
                            Next
                        </Button>
                    }
                </Form>
            </Container>
        </Modal.Body>

        <Modal.Footer>
            <Alert>
                Don't Have An Account?{` `}
            <Alert.Link href="#" onClick={this.redirectToSignup}>Sign Up Here!</Alert.Link>
            </Alert>
        </Modal.Footer>
    </Modal.Dialog>
    }
}

export default withRouter(EmailForm);