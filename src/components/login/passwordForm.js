import React from 'react';
import { Container, Col, Row, Modal, Button, Image, Form, Alert, Spinner } from 'react-bootstrap';
import Stepper from "react-stepper-horizontal";
import firebase from "firebase";
import { withRouter } from 'react-router-dom';

import '../../assets/styles.css';
import Avatar from '../../assets/avatar_placeholder.png';

class PasswordForm extends React.Component {
    
    state = {
        password: "",
        isFormValidated: false,
        isPasswordValid: false,
        isLoading: false,

        firebaseError: "",
    };

    onChange = (e) => {
        this.setState({ password : e.target.value, });
    };

    authUser = async () => {
        return await firebase
            .auth()
            .signInWithEmailAndPassword(this.props.userEmail, this.state.password)
            .catch( err => {
                if(err.code === 'auth/wrong-password') {
                    this.setState({isPasswordValid: false})
                    return false;
                }
                else {
                    this.setState({firebaseError: err.message})
                    return false;
                }
            });
    }

    onPasswordSubmit = async (e) => {

        e.preventDefault();
        e.stopPropagation();

        // Clear error and update states
        this.setState({ firebaseError: "", isLoading : true, isFormValidated : true});

        // Check database for user
        let isVerifiedUser = await this.authUser();

        // Update States and callback
        if (isVerifiedUser) {
            this.setState({ isFormValidated: false,  isLoading : false })
            this.props.passwordVerified();
        }

        else {
            this.setState({ isLoading : false })
        }
    }

    render() {

        // Form Styles
        let passwordStyle = {
            value: this.state.password,
            type: "password",
            required: true,
            onChange: this.onChange,
            minLength: "6",
            placeholder: "Enter Password",
        };

        let invalidStyle = {
            isInvalid: true,
        };

        return <Modal.Dialog centered>
            <Modal.Header>
                <Col>
                    <Row>
                        <Col>
                        <Button variant="outline-dark" onClick={this.props.backButton} size="back">
                            {"<"}
                        </Button>
                        </Col>
                        <Col xs={2}>
                            <Image height="60rem" roundedCircle src={Avatar} />
                        </Col>
                        <Col></Col>
                    </Row>
                    <Row className="modal-title">
                        <Modal.Title>User Login</Modal.Title>
                    </Row>
                    <Row>
                    <Stepper steps={[
                        {title: 'Enter Email'}, 
                        {title: 'Enter Password'}, 
                        {title: 'Success!'} ]} 
                        activeStep={ 1 }
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
                    <Form
                        onSubmit={e => this.onPasswordSubmit(e)}
                    > 
                        {/* Password Form */}
                        <Form.Group id="login_password">
                            <Form.Label>Password</Form.Label>
                            {this.state.isFormValidated && !this.state.isLoading
                                ? <Form.Control
                                    {...passwordStyle}
                                    {...invalidStyle}
                                />
                                : <Form.Control
                                    {...passwordStyle}
                                />
                            }
                            {this.state.isFormValidated && !this.state.isPasswordValid
                                ? <Form.Control.Feedback type="invalid"> Invalid Password! </Form.Control.Feedback>
                                : null
                            }
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
                                Log In
                            </Button>
                        }
                    </Form>
                </Container>
            </Modal.Body>

            <Modal.Footer>
                <Alert>
                    Don't Have An Account?{` `}
                <Alert.Link href="#" onClick={this.props.redirectToSignup}>Sign Up Here!</Alert.Link>
                </Alert>
            </Modal.Footer>
        </Modal.Dialog>
    }
}

export default withRouter(PasswordForm);