import React from 'react';
import { Container } from 'react-bootstrap';
import { Input } from 'react-chat-elements';
import { FaPaperPlane } from 'react-icons/fa';

import firebase from "firebase";

class ChatBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = { message: "" };
        
        this.onMessageChange = this.onMessageChange.bind(this);
        this.onMessageSubmit = this.onMessageSubmit.bind(this);
    };
    
    onMessageChange(e) {
        this.setState({ message: e.target.value });
    };

    async onMessageSubmit(e) {
        e.preventDefault();

        let userHandles = this.props.user.localeCompare(this.props.selectedUser)
                            ? [this.props.user, this.props.selectedUser]
                            : [this.props.selectedUser, this.props.user];

        let userIDs = this.props.selectedChatID.split("_");

        let currentTime = await firebase
            .firestore
            .Timestamp
            .now()
            .toMillis();

        firebase
            .firestore()
            .collection("chats")
            .doc(this.props.selectedChatID)
            .set({
                chatID: this.props.selectedChatID,
                messages: {
                    [currentTime] : {
                        message: this.state.message,
                        seen: false,
                        sender: this.props.user,
                    }
                },
                latestMessage: currentTime,
                users: userIDs,
                userHandles: userHandles
                }, {merge: true})
            .catch(e => alert(e));
    };
    
    render() {
        return (
            <Container style={{
                    padding: "0 0.5rem",
                    borderStyle: "solid",
                    borderWidth: "1px",
                    marginTop: "1rem"
                }}
            >
                {this.props.chat !== null
                    ? <Input
                        placeholder="Enter Message..."
                        onChange={this.onMessageChange}
                        ref="input"
                        rightButtons={
                            <FaPaperPlane 
                                onClick={this.onMessageSubmit}
                            />
                        }
                        onKeyPress={async (e) => {
                            if (e.charCode === 13) {
                                await this.onMessageSubmit(e); 
                                this.refs.input.clear();
                            }
                            return;
                        }}
                    />
                    : null
                }
            </Container>
        );
    }
}

export default ChatBox;
