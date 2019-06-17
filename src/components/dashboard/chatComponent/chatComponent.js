import React from 'react';
import { Container, Spinner, Row, Col } from 'react-bootstrap';

import 'react-chat-elements/dist/main.css';
import ChatDisplay from './chatDisplay';
import ChatBox from './chatBox';
import ChatSidebar from './chatSidebar';
import ChatTopbar from './chatTopbar';

/* Chat Format
{
    chatID : {user1}_{user2}
    messages : {
        {sentTime} : {
            message : {messageText}
            seen : {T/F}
            sender : {user1Handle/user2Handle}
        }
    }
    users : [user1, user2]
    userHandles : [userHandle1, userHandle2]
}
*/

class ChatComponent extends React.Component {

    state = {
        selectedChatID : null,
        selectedUser : null,
    }

    // Format date from Javascript Date Object
    dateFormatter = (messageTime) => {
        let currentDate = new Date();
        // If same day, return in 12-Hour Format
        if (currentDate.getFullYear() === messageTime.getFullYear() 
            && currentDate.getMonth() === messageTime.getMonth()
            && currentDate.getDate() === messageTime.getDate()) {
            return messageTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        }

        // Else return date of message in DD/MM/YY
        else {
            return messageTime.getDate() + "/" + (messageTime.getMonth() +1) + "/" + (messageTime.getFullYear() % 100);
        }
    }


    // Callback for setting selected chat by filtering chats and setting state
    setSelectedChat = (selectedHandle) => {
        let thisChat = this.props.chats.filter(
            chat => (chat.userHandles[0] === selectedHandle || chat.userHandles[1] === selectedHandle));
        this.setState({selectedChatID: thisChat[0].chatID, selectedUser: selectedHandle});
    }

    addEmptyChat = (partnerHandle, partnerUserID) => {
        let newChatID = this.props.userID.localeCompare(partnerUserID) < 0
                            ? this.props.userID + "_" + partnerUserID
                            : partnerUserID + "_" + this.props.userID;
        this.setState({selectedChatID: newChatID, selectedUser: partnerHandle});
    }

    render() {
        return <Container>
            {this.props.chats === null
                ? <Container style={{paddingTop:"10rem", textAlign:"center"}}>
                    <Spinner animation="border" role="status" variant="info"/>
                    <br></br>
                    Loading Chats...
                </Container>
                : <Container style={{padding:"0px", margin:"0px"}}>  
                    <Row md={2} lg={2} >
                        {this.state.selectedUser
                            ? <ChatTopbar
                                selectedUser={this.state.selectedUser}
                            />
                            : <ChatTopbar
                                selectedUser={""} 
                            />
                        }
                    </Row>
                    <Row md={10} lg={10}>
                        <Col md={3} lg={3}>
                                <ChatSidebar 
                                    chats={this.props.chats} 
                                    user={this.props.user}
                                    setSelectedChat={this.setSelectedChat}
                                    addEmptyChat={this.addEmptyChat}
                                    dateFormatter={this.dateFormatter}
                                />
                        </Col>
                        <Col md={true} lg={true}>
                            {this.state.selectedChatID
                                ? <Container>
                                    <ChatDisplay
                                        chats={this.props.chats}
                                        selectedChatID={this.state.selectedChatID}
                                        user={this.props.user} 
                                        dateFormatter={this.dateFormatter}
                                        />
                                    <ChatBox 
                                        selectedChatID={this.state.selectedChatID}
                                        selectedUser={this.state.selectedUser}
                                        user={this.props.user}
                                    />
                                </Container>
                                : null
                            }
                        </Col>
                    </Row>  
                </Container>  
            }
        </Container>
    }
}

export default ChatComponent;