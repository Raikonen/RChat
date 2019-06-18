import React from 'react';
import { Container, Col, Row, Modal, Button, Image, Form, Alert, Spinner } from 'react-bootstrap';
import firebase from "firebase";

import '../../assets/styles.css';
import Avatar from '../../assets/avatar_placeholder.png';

class Signup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            isValid: false,
    
            isFormValidated: false,
            firebaseError: "",
        };

        this.onFormChange = this.onFormChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }
    
    /* Form Validation Helper Functions */
    checkValidPassword = () => (this.state.password.length >= 6);

    checkMatchPassword = () => (this.state.password !== "" && this.state.password === this.state.confirmPassword);

    checkValidEmail = () => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email));

    checkValidForm = () => (this.checkValidEmail() && this.checkValidPassword() && this.checkMatchPassword());

    /* Other Helper Functions */
    redirectToDashboard = () => this.props.history.push('/dashboard');

    redirectToLogin = () => this.props.history.push('/login');

    onFormChange(e) {
        this.setState({ [e.target.id]: e.target.value }, 
            () => this.checkValidForm() 
                ? this.setState({isValid: true})
                : this.setState({isValid: false}));
    };

    async signupUser() {
        // Authenticate User and log errors if any
        await firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(async (authRes) => {
                const userObj = {
                    email : authRes.user.email,
                    userID : authRes.user.uid,
                };
                await firebase    
                    .firestore()
                    .collection("users")
                    .doc(this.state.email)
                    .set(userObj)
                    .catch((e) => (this.setState({ firebaseError: e.message })))
            })
            .catch((e) => {this.setState({ firebaseError: e.message })});
    }

    async onFormSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        // Clear error and update states
        this.setState({ firebaseError: "", isLoading: true, isFormValidated: true });
        
        // Stop if form invalid
        if (!this.state.isValid) {
            this.setState({ isLoading: false });
            return;
        }

        // Sign user up
        await this.signupUser();        

        // Update Loading State
        this.setState({ isLoading: false });

        // Redirect to Login if signed up without error
        if(this.state.firebaseError === "")
            this.redirectToDashboard();
    }

    render() {
        // Base and Validation Styles for Form
        let emailBaseStyle = {
            value: this.state.email,
            type: "email",
            required: true,
            onChange: this.onFormChange,
            placeholder: "Enter Email", 
        };

        let emailValidationStyle = {
            isValid: this.checkValidEmail(),
            isInvalid: !this.checkValidEmail(),
        };

        let passwordBaseStyle = {
            value: this.state.password,
            type: "password",
            required: true,
            onChange: this.onFormChange,
            minLength: "6",
            placeholder: "Enter Password",
        };
        
        let passwordValidationStyle = {
            isValid: this.checkValidPassword(),
            isInvalid: !this.checkValidPassword(),
        };
        
        let confirmPasswordBaseStyle = {
            value: this.state.confirmpassword,
            type: "password",
            required: true,
            onChange: this.onFormChange,
            placeholder: "Enter Password Again",
        };

        let confirmPasswordValidationStyle = {
            isValid: this.checkMatchPassword(),
            isInvalid: !this.checkMatchPassword(),
        };

        return (
            <div>
                <Modal.Dialog centered>
                
                    <Modal.Header>
                        <Col>
                            <Row style={{ justifyContent: "center" }}>
                                <Image height="60rem" roundedCircle src={Avatar}/>
                            </Row>
                            <Row style={{ justifyContent: "center", color: "grey" }}>
                                <Modal.Title>User Sign Up</Modal.Title>
                            </Row>
                        </Col>
                    </Modal.Header>

                    <Modal.Body>
                        <Container>

                            {/* Email Form */}
                            <Form onSubmit = {e => this.onFormSubmit(e)}> 
                                <Form.Group controlId="email">
                                    <Form.Label>Email address</Form.Label>
                                    {this.state.isFormValidated
                                        ? <Form.Control
                                            {...emailBaseStyle}
                                            {...emailValidationStyle}
                                        />
                                        : <Form.Control
                                            {...emailBaseStyle}
                                        />
                                    }
                                    <Form.Control.Feedback type="invalid">
                                        Please Enter a Valid Email
                                    </Form.Control.Feedback>
                                    <Form.Text className="text-muted">
                                        We'll never share your email with anyone else.
                                    </Form.Text>
                                </Form.Group>

                            {/* Password Form */}
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                {this.state.isFormValidated 
                                    ? <Form.Control
                                        {...passwordBaseStyle}
                                        {...passwordValidationStyle}
                                    />
                                    : <Form.Control
                                        {...passwordBaseStyle}
                                    />
                                }
                                <Form.Control.Feedback type="invalid">
                                    Password has to be at least 6 characters!
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Confirmation Password Form */}
                            <Form.Group controlId="confirmPassword">
                                <Form.Label>Confirm Your Password</Form.Label>
                                {this.state.isFormValidated
                                    ? <Form.Control
                                        {...confirmPasswordBaseStyle}
                                        {...confirmPasswordValidationStyle}
                                    />
                                    : <Form.Control
                                        {...confirmPasswordBaseStyle}
                                    />
                                }
                                <Form.Control.Feedback type="invalid">
                                    Passwords did not match!
                                </Form.Control.Feedback>
                            </Form.Group>
                            
                            {/* Firebase Error Display*/}
                            {this.state.firebaseError 
                                ? <Alert variant="danger">{this.state.firebaseError}</Alert> 
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
                                        />
                                        <span>{` `}Loading...</span>
                                </Button>
                                : <Button variant="info" type="submit" block>
                                    Create Account
                                </Button>
                            }
                            </Form>
                        </Container>
                    </Modal.Body>

                    <Modal.Footer>
                        <Alert>
                            Already Have An Account?{` `}
                            <Alert.Link href="#" onClick={this.redirectToLogin}>
                                Log In Here!
                            </Alert.Link>
                        </Alert>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        );
    }
}

export default Signup;
