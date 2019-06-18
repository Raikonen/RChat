import React from 'react';
import { Container, Col, Row} from 'react-bootstrap';
import { MessageList } from 'react-chat-elements';

class ChatDisplay extends React.Component {
    
    constructor(props) {
        super(props);
        this.scrollableChat = React.createRef();
    }

    componentDidMount() {
        let displayedChat = this.scrollableChat.current;
        displayedChat.scrollTop = displayedChat.scrollHeight
    }

    componentDidUpdate() {
        let displayedChat = this.scrollableChat.current;
        displayedChat.scrollTop = displayedChat.scrollHeight
    }
    
    /* Helper Functions */
    formatMessages = () => {
        // Get messages for the selected chat from chats
        let filteredChat = this.props.chats.filter(chat => (this.props.selectedChatID === chat.chatID));
        let messages = filteredChat.length === 0 ? null : filteredChat[0].messages;

        // Check if chat is selected
        if (!messages)
            return [];

        let keys = Object.keys(messages);
        let formattedMessages = [];

        keys.forEach( key =>
            formattedMessages.push({
                position: messages[key].sender === this.props.user ? "left" : "right",
                type: "text",
                text: messages[key].message,
                dateString: this.props.dateFormatter(new Date(parseInt(key))),
            })
        )
        return formattedMessages;
    }

    render() {
        return (
            <Container style={{ padding:"0px" }}>
                <Col style={{ padding:"0px"}}>
                    <Row style={{ margin:"1rem 0rem", height:"3rem", backgroundColor:"#d7ecff", paddingTop:"0.7rem"}}>
                        <Container style={{ textAlign:"center" }}>
                            {this.props.selectedUser}
                        </Container>
                    </Row>
                    <Row>
                        <Container 
                            ref={this.scrollableChat}
                            style={{ margin:"0.5rem 1rem 0 0", padding:"0.5rem 0 0.5rem 0", height:"65vh", overflowY:"scroll" }}
                        >
                            <MessageList
                                className='message-list'
                                lockable={true}
                                toBottomHeight={'100%'}
                                dataSource={this.formatMessages()} 
                            />
                        </Container>
                    </Row>
                </Col>
            </Container>
        );
    }
}

export default ChatDisplay;
