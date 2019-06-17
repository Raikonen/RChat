import React from 'react';
import { Container } from 'react-bootstrap';
import { MessageList } from 'react-chat-elements';

class ChatDisplay extends React.Component {
    
    constructor(props) {
        super(props);
        this.scrollableChat = React.createRef();
    }

    formatMessages = () => {
        // Get messages for the selected chat from chats
        let filteredChat = this.props.chats.filter(chat => this.props.selectedChatID === chat.chatID);
        let messages = filteredChat.length === 0 ? null : filteredChat[0].messages;

        // Check if chat is selected
        if (!messages)
            return [];

        let keys = Object.keys(messages);
        let formattedMessages = [];

        keys.forEach( key =>
            formattedMessages.push(
                {
                    position: messages[key].sender === this.props.user ? "left" : "right",
                    type: "text",
                    text: messages[key].message,
                    dateString: this.props.dateFormatter(new Date(parseInt(key))),
                }
            )
        )
        return formattedMessages;
    }

    componentDidMount() {
        let displayedChat = this.scrollableChat.current;
        displayedChat.scrollTop = displayedChat.scrollHeight
    }

    componentDidUpdate() {
        let displayedChat = this.scrollableChat.current;
        displayedChat.scrollTop = displayedChat.scrollHeight
    }

    render() {
        return <Container ref={this.scrollableChat} style={{ marginTop:"0.5rem", paddingTop:"0.5rem", height:"30rem", overflowY:"scroll"}}>
                    <MessageList
                        className='message-list'
                        lockable={true}
                        toBottomHeight={'100%'}
                        dataSource={this.formatMessages()} 
                    />
                </Container>
    }
}

export default ChatDisplay;