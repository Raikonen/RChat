import React from 'react';
import { Container, Row, Col, Button, FormControl, Form, InputGroup } from 'react-bootstrap';
import { ChatList } from 'react-chat-elements';
import { FaSearch } from 'react-icons/fa'
import firebase from "firebase";


import Avatar from '../../../assets/avatar_placeholder.png';

class ChatSidebar extends React.Component {

    state = {
        addingChat : false,
        invalidUser : false,

        userToBeAdded : "",
    }

    formatChatItems = () => {
        // Check if chats have been received
        if (this.props.chats.length === 0) {
            return [];
        }

        let chats = this.props.chats;
        
        let formattedItems = Object.values(chats).map(chat => {
            return {
                avatar: Avatar,
                title: this.props.user === chat.userHandles[0] ? chat.userHandles[1] : chat.userHandles[0],
                subtitle: chat.messages[chat.latestMessage].message,
                date: new Date(),
                dateString: this.props.dateFormatter(new Date(parseInt(chat.latestMessage))), 
                unread: 0,
            }
        });
        return formattedItems;
    }
    
    showAddChatForm = () => this.setState(prevState => ({
        addingChat: !prevState.addingChat,
        userToBeAdded: "",
        invalidUser: false,
        }));


    addChat = async (e) => {
        await this.setState({invalidUser: false});
        // Search database for user
        await firebase
            .firestore()
            .collection("users")
            .where('handle', '==' , this.state.userToBeAdded)
            .get()
            .then(doc => {
                if (doc.empty) {
                    this.setState({invalidUser : true});
                }
                else {
                    let data = doc.docs[0].data();
                    this.props.addEmptyChat(data.handle, data.userID);
                    this.showAddChatForm();
                }
            })
    }

    render() {
        let formStyle = {
            marginLeft : "-5px", 
            block : true, 
            placeholder : "Handle",
            value : this.state.userToBeAdded,
            onChange : (e) => this.setState({userToBeAdded : e.target.value}),
            onKeyPress : async (e) => {
            if (e.charCode === 13) {
                await this.addChat(e); 
            }}
        };

        return <div>
            <Col style={{padding:"0px"}}>
                <Row 
                    style={{ margin:"1rem 0rem", height:"3rem", backgroundColor:"#d7ecff", padding:"0.7rem 0rem 0rem 0rem"}}>
                    <Container style={{ textAlign:"center" }}>
                        Chats
                    </Container>
                </Row>
                <Row>
                    {/* Add Chat Interface */}
                    <Container style={{paddingBottom: "1rem"}}>
                        <Col>
                            <Row style={{padding:"0rem 1rem 0.5rem 1rem"}}>
                                    <Button variant="outline-success" block onClick={this.showAddChatForm}>Add Chat</Button>
                            </Row>
                            <Row style={{padding:"0rem 1rem 0rem 1rem"}}>
                                {this.state.addingChat 
                                    ? <InputGroup>
                                    { this.state.invalidUser
                                            ? <FormControl 
                                                {...formStyle}
                                                isInvalid = {true}
                                                />
                                            : <FormControl 
                                                {...formStyle}
                                                />
                                        }
                                        <Form.Control.Feedback type="invalid">User Not Found</Form.Control.Feedback>
                                        { this.state.invalidUser
                                            ? null 
                                            : <InputGroup.Append>
                                                <Button
                                                    variant="outline-success" 
                                                    style={{margin:"0px"}} 
                                                    onClick={this.addChat}>
                                                    <FaSearch/>
                                                </Button>
                                            </InputGroup.Append>
                                        }
                                </InputGroup>
                                : null
                                }
                            </Row>
                        </Col>
                    </Container>
                </Row>
                <Row>
                    <Container>
                        <ChatList
                            className='chat-list'
                            dataSource={this.formatChatItems()} 
                            onClick={(c) => this.props.setSelectedChat(c.title)}      
                        />
                    </Container>
                </Row>
            </Col>
        </div>

    }
}

export default ChatSidebar;