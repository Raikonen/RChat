import React from 'react';
import { Container,Image, Dropdown, DropdownButton, Nav, Navbar, Spinner } from 'react-bootstrap';
import firebase from "firebase";

import '../../assets/styles.css';
import Avatar from '../../assets/avatar_placeholder.png';

import SetHandle from './setHandle';
import ChatComponent from './chatComponent/chatComponent';

class Dashboard extends React.Component {

    // Firestore chatObserver
    chatObserver = null;

    state = {
        userEmail : null,
        userHandle : null,
        userID : null,
        chats : null,

        loggedIn : false,
        redirecting : false,
        showHandleForm : false,

        firebaseError: "",
    }

    redirectToLogin = () => this.setState({redirecting:false}, this.props.history.push('/login'));

    signOut = async () => {
        await firebase.auth().signOut();
        console.log("signed out");
    }

    getUser = async () => {
        // Update current user
        await firebase
            .auth()
            .onAuthStateChanged( 
                async (user) => {
                    // If Logged In
                    if (user) {
                        await this.setState({loggedIn : true});
                        // Prompt user to set handle if undefined
                        let userData = await firebase
                            .firestore()
                            .collection("users")
                            .doc(user.email)
                            .get();

                        let handle = userData.get("handle");
                        if( handle === undefined) {
                            await this.setState( {showHandleForm : true, userID : userData.get("userID")});
                        }
                        else
                            await this.setState({userHandle : handle, userID : userData.get("userID")})

                        // Set user email and document chatObserver for the user
                        await this.setState({userEmail : user.email}, this.setObserver);
                    }
                    // If Logged Out
                    else {
                        // Change redirecting state and redirect after 2 seconds
                        await this.setState({redirecting : true});
                        setTimeout(() => this.setState({userEmail : null}, this.redirectToLogin()), 2000);
                    }
            })
    }

    setObserver = () => {
        this.chatObserver = firebase
            .firestore()
            .collection("chats")
            .where("users", "array-contains", this.state.userID)
            .onSnapshot(docSnapshot => {
                console.log("Snapshotted");
                let myChats = [];
                docSnapshot.forEach(
                    (documentSnapshot) => {
                        let chat = documentSnapshot.data();
                        myChats.push(chat);
                });
                this.setState({chats : myChats});
            }
            , err => {
                this.setState({firebaseError : err});
            });
    }

    updateHandle = (handle) => this.setState({showHandleForm : false, userHandle : handle});

    setHandle = async (newHandle) => {
        return await firebase  
            .firestore()
            .collection("users")
            .where("handle", "==", newHandle)
            .get()
            .then(async res => res.empty 
                ? await firebase
                    .firestore()
                    .collection("users")
                    .doc(this.state.userEmail)
                    .set({handle : newHandle}, {merge : true})
                    .then(() => true)
                    .catch(e => {
                        this.setState({ firebaseError: e.message }, () => alert(this.state.firebaseError));
                    })
                : false
            )
            .catch(e => {   
                this.setState({ firebaseError: e.message }, () => alert(this.state.firebaseError));
            }); 
        }


    componentDidMount() {
        this.getUser();
    }

    componentWillUnmount() {
        this.chatObserver();
    }

    render() {
        return <div >
            {this.state.showHandleForm 
                ? <SetHandle updateHandle = {this.updateHandle} setHandle={this.setHandle}/>
                : null }

            <div style={{backgroundColor:"#343a40"}}>
                <Container>
                    <Navbar bg="dark" variant="dark">
                        <Navbar.Brand>
                        { 'RCHAT' }
                        </Navbar.Brand>
                        <Navbar.Collapse>
                            <Nav className="justify-content-end" style={{ marginRight:"20px", width: "100%" }}>
                                <Nav>
                                    <DropdownButton
                                        title = {
                                            <Image height="32px" width="32px" style={{marginTop:"2px", marginRight:"20px"}} src={Avatar}/>
                                        }
                                        variant="secondary" 
                                        id="dropdown-basic">
                                        <Dropdown.Menu>
                                            <Dropdown.Item disabled>Currently Logged in as: </Dropdown.Item>
                                            <Dropdown.Item disabled>{this.state.userHandle ? this.state.userHandle : this.state.userEmail}</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={this.signOut}>Sign Out!</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </DropdownButton>
                                </Nav>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Container>
            </div>

            <Container style={{backgroundColor:"white", width:"100%", height:'calc(100vh - 64px)'}}>
                    { this.state.redirecting
                        ? <Container>
                            <Spinner animation="grow" size="sm" /> Redirecting to Login Page...
                            </Container>
                    
                        : null
                    }
                    { this.state.loggedIn
                        ? <ChatComponent 
                            user = {this.state.userHandle} 
                            userID = {this.state.userID}
                            chats = {this.state.chats} />
                        : null
                    }
            </Container>
        </div>
    }
}

export default Dashboard;