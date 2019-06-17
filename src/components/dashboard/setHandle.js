import React from 'react';
import { Modal, Form, FormControl, Button, Alert } from 'react-bootstrap';


class SetHandle extends React.Component {

    state = { 
        newHandle: "",

        handleTaken: false,
        handleInvalid: false,
    }
    
    handleChange = (e) => {
        this.setState({ newHandle : e.target.value });
    }

    handleRegex = /^[a-zA-Z0-9]+$/;

    onSubmit = async (e) => {
        e.preventDefault();
        if (!this.handleRegex.test(this.state.newHandle)) {
            this.setState({handleInvalid: true})
            return;
        }

        if(await this.props.setHandle(this.state.newHandle))
            this.props.updateHandle(this.state.newHandle);
        else
            this.setState({handleTaken : true});
    };

    render() {
        return <Modal style={{textAlign:"center"}} show={true} onHide={()=>{}} >
                <Modal.Header>
                <Modal.Title >Choosing a Handle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    It seems to be your first time logging in, please choose a handle for other users to recognise you by!
                    </Modal.Body>
                    <Modal.Footer style={{ display:"block", textAlign: "center"}}>
                    <Form
                        onSubmit={this.onSubmit}
                    >
                        <Form.Group controlId="handle">
                            {this.state.handleTaken || this.state.handleInvalid
                                ? <FormControl
                                placeholder="Enter Handle"
                                onChange={this.handleChange}
                                newHandle = {this.state.newHandle}
                                isInvalid = {true}
                                />
                                : <FormControl
                                placeholder="Enter Handle"
                                onChange={this.handleChange}
                                newHandle = {this.state.newHandle}
                                />
                            }
                        </Form.Group>
                        { this.state.handleTaken ?
                        <Alert variant="danger"> Handle has been taken. Please choose another one!</Alert>
                        : (this.state.handleInvalid)
                            ? <Alert variant="danger"> Handle is invalid, Please only use alphanumeric characters </Alert>
                            : null
                        }
                        <Button variant = "outline-success">
                            Go
                        </Button>
                    </Form>
                   
                </Modal.Footer>
            </Modal>
    }
}

export default SetHandle;