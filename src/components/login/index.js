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

    /* Helper Functions */
    redirectToDashboard = () => this.props.history.push('/dashboard');

    render() {
        return (
            <Container>
                {!this.state.isEmailFound
                    ? <EmailForm emailFound={(email) => this.setState({isEmailFound: true, userEmail : email})}/>
                    : <PasswordForm 
                        backButton={() => this.setState({isEmailFound: false})} 
                        userEmail={this.state.userEmail} 
                        passwordVerified={this.redirectToDashboard}
                    />
                }
            </Container>
        );
    }
}

export default Login;
