import React from 'react';
import { Modal, Button} from 'react-bootstrap';
import fire from '../fire';

/**
 * Displayed when user clicks Log Out button.
 * Called in Navigation.js
 * 
 * @param {boolean} show indicating whether modal is open showing
 * @param {function} onHide what to do when closing modal
 */
class LogoutModal extends React.Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
    }

    logOut() {
        fire.auth().signOut().then(function() {
            window.location.href="/";

        }).catch(function(error) {
            console.log("Sign out ERROR");
        })
    }
    
    render() {
        return (
            <Modal
            show={this.props.show}
            onHide={this.props.onHide}
            animation={false}
            size="sm" 
            aria-labelledby="contained-modal-title-vcenter" 
            centered>
                <Modal.Header closeButton>
                    <Modal.Title>Log Out</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to log out?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.logOut}>Log Out</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default LogoutModal;