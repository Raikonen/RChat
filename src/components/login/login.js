import React from 'react';
import { Container } from 'react-bootstrap';

import EmailForm from './emailForm';
import PasswordForm from './passwordForm';

class Login extends React.Component {

    state = {
        isEmailFound: false,
        userEmail: "",
        userPassword: "",
    };

    redirectToSignup = () => this.props.history.push('/signup');

    redirectToDashboard = () => this.props.history.push('/dashboard');

    backToEmailForm = () => {
        this.setState({isEmailFound: false});
    }

    emailFound = (email) => { 
        this.setState({isEmailFound: true, userEmail : email});  
    }

    passwordVerified = () => {
        this.redirectToDashboard();
    }

    render() {
        return <Container>
            {!this.state.isEmailFound
                ? <EmailForm emailFound={this.emailFound} />
                : <PasswordForm 
                    backButton={this.backToEmailForm} 
                    userEmail={this.state.userEmail} 
                    passwordVerified={this.passwordVerified}/>
            }
        </Container>
    }
}

export default Login;