import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

class ChatTopbar extends React.Component {

    render() {
        return <Container style={{ textAlign:"center", margin:"1rem 0rem", height:"3rem", backgroundColor:"#d7ecff"}}>
                    <Row style={{height : "100%"}}>
                        <Col md={3} lg={3} style={{ paddingTop:"0.7rem", }}>
                            Chats
                        </Col>
                        <Col md={true} lg={true} style={{borderLeft:"solid", borderLeftWidth:"1rem", borderColor:"grey", paddingTop:"0.7rem"}}>
                            {this.props.selectedUser}
                        </Col>
                    </Row>
                </Container>
    }
}

export default ChatTopbar;