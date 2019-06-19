import React from 'react';
import { Container, Spinner, Row, Col } from 'react-bootstrap';

import 'react-chat-elements/dist/main.css';
import '../../../assets/styles.css'

import ChatDisplay from './chatDisplay';
import ChatBox from './chatBox';
import ChatSidebar from './chatSidebar';

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

/** TODO
 * Add read/unread feature
 * Css for TopBar and fonts
 */

class ChatComponent extends React.Component {

    state = {
        selectedChatID : null,
        selectedUser : null,
    }

    // Format date from Javascript Date Object
    dateFormatter = (messageTime) => {
        let currentDate = new Date();

        if (currentDate.getFullYear() === messageTime.getFullYear() 
            // If same day, return in 12-Hour Format
            && currentDate.getMonth() === messageTime.getMonth()
            && currentDate.getDate() === messageTime.getDate()) {
            return messageTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        } else {
            // Else return date of message in DD/MM/YY
            return `${messageTime.getDate()}/${(messageTime.getMonth() + 1)}/${(messageTime.getFullYear() % 100)}`;
        }
    }

    // Callback for setting selected chat by filtering chats and setting state
    setSelectedChat = (selectedHandle) => {
        let thisChat = this.props.chats.filter(
            chat => (chat.userHandles[0] === selectedHandle || chat.userHandles[1] === selectedHandle));
        this.setState({ selectedChatID: thisChat[0].chatID, selectedUser: selectedHandle });
    }

    addEmptyChat = (partnerHandle, partnerUserID) => {
        let newChatID = (this.props.userID.localeCompare(partnerUserID) < 0)
                            ? `${this.props.userID}_${partnerUserID}`
                            : `${partnerUserID}_${this.props.userID}`;
        this.setState({ selectedChatID: newChatID, selectedUser: partnerHandle });
    }

    render() {
        return (
            <div style={{ height: "100%" }}>
                {this.props.chats === null
                    ? <Container style={{ paddingTop: "10rem", textAlign: "center" }}>
                        <Spinner animation="border" role="status" variant="info"/>
                        <br></br>
                        Loading Chats...
                    </Container>
                    : <div style={{ height: "100%" }}>  
                        <Row style={{ height: "100%" }}>
                            <Col xs={0} sm={0} md={3} lg={3}>
                                <ChatSidebar 
                                    chats={this.props.chats} 
                                    user={this.props.user}
                                    setSelectedChat={this.setSelectedChat}
                                    addEmptyChat={this.addEmptyChat}
                                    dateFormatter={this.dateFormatter}
                                />
                            </Col>
                            <Col style={{ padding: "0px" }} xs={0} sm={0} md={"auto"} lg={"auto"}>
                                <div style={{ padding: "1rem 0rem", width: "0.5rem", height: "100%" }}>
                                    <div style={{ backgroundColor: "#DCDCDC", height: "100%" }}>
                                    </div>
                                </div>
                            </Col>
                            <Col xs sm md lg>
                                {this.state.selectedChatID
                                    ? <div>
                                        <ChatDisplay
                                            chats={this.props.chats}
                                            selectedChatID={this.state.selectedChatID}
                                            user={this.props.user}
                                            selectedUser={this.state.selectedUser}
                                            dateFormatter={this.dateFormatter}
                                        />
                                        <ChatBox 
                                            selectedChatID={this.state.selectedChatID}
                                            selectedUser={this.state.selectedUser}
                                            user={this.props.user}
                                        />
                                    </div>
                                    : <Container style={{ padding: "0px" }}>
                                        <Col
                                            style={{
                                                textAlign: "center",
                                                margin: "1rem 0rem",
                                                height: "3rem",
                                                backgroundColor: "#d7ecff",
                                                paddingTop: "0.7rem"
                                            }}
                                        />
                                        <Col>
                                            <Container
                                                className="text-muted"
                                                style={{ textAlign: "center", paddingTop: "6rem" }}
                                            >
                                                Please add or select a chat to start messaging!
                                            </Container>
                                        </Col>
                                    </Container>
                                }
                            </Col>
                        </Row>
                    </div>  
                }
            </div>
        );
    }
}

export default ChatComponent;
