import React from 'react';
import { Container } from 'react-bootstrap';
import { Input } from 'react-chat-elements';
import { FaPaperPlane } from 'react-icons/fa';

import firebase from "firebase";

class ChatBox extends React.Component {
    state = { value: "" }
    
    handleChange = (e) => {
        this.setState({ value : e.target.value });
    }

    onSubmit = async (e) => {
        e.preventDefault();
        let userHandles = this.props.user.localeCompare(this.props.selectedUser)
                            ? [this.props.user, this.props.selectedUser]
                            : [this.props.selectedUser, this.props.user];                            ;
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
                            message: this.state.value,
                            seen: false,
                            sender: this.props.user,
                        }
                    },
                    latestMessage : currentTime,
                    users : userIDs,
                    userHandles : userHandles
                    }, {merge:true})
                .catch(err => alert(err));
    };
    
    render() {
        return <Container style={{ padding : "0rem 0.5rem"}} className="chatbox-container">
            {this.props.chat !== null
                ? <Input
                    placeholder="Enter Message..."
                    onChange={this.handleChange}
                    ref= "input"
                    rightButtons={
                        <FaPaperPlane 
                            onClick={this.onSubmit}
                        />
                            
                    }
                    onKeyPress={async (e) => {
                        if (e.shiftKey && e.charCode === 13) {
                            return true;
                        }
                        if (e.charCode === 13) {
                            await this.onSubmit(e); 
                            this.refs.input.clear();
                            return false;
                        }
                    }}
                />
                : null
            }
        </Container>
    }
}

export default ChatBox;