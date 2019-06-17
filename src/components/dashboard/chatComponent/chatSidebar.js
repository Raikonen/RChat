import React from 'react';
import { Container, Row, Col, Button, FormControl, Form } from 'react-bootstrap';
import { ChatList } from 'react-chat-elements';
import { FaSearch} from 'react-icons/fa'
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
        addingChat: !prevState.addingChat
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
            placeholder : "Enter User Email",
            value : this.state.userToBeAdded,
            onChange : (e) => this.setState({userToBeAdded : e.target.value}),
            onKeyPress : async (e) => {
            if (e.charCode === 13) {
                await this.addChat(e); 
            }}
        };

        return <Container>
            <Row className="justify-content-md-center" style={{paddingBottom:"0.5rem"}}>
                <Button variant="outline-success" block onClick={this.showAddChatForm}>Add Chat</Button>
            </Row>
            {this.state.addingChat 
            ? <Form.Row style={{paddingBottom:"0.5rem"}}>
                <Col md={10} lg={10}>
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
                </Col>
                <Col md={2} lg={2}>
                    <Button variant="outline-success" style={{marginRight:"5px"}} onClick={this.addChat}>
                        <FaSearch/>
                    </Button>
                </Col>
            </Form.Row>
            : null
            }   
            <ChatList
                className='chat-list'
                dataSource={this.formatChatItems()} 
                onClick={(c) => this.props.setSelectedChat(c.title)}      
            />
            </Container>
    }
}

export default ChatSidebar;