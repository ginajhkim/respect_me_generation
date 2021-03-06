import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

/**
 * Displayed when text is too long.
 * Called in CreateCard.js and AddComment.js
 * 
 * @param {boolean} show indicating whether modal is open showing
 * @param {function} onHide what to do when closing modal
 */
class TextLengthModal extends Component {

    render(){
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} animation={false} size='sm' aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Text is too long</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <div className='container'>
                            Text has to be less than {this.props.textLength} characters.
                        </div>
                    </Modal.Body>
            </Modal>
        )
    }
};

export default TextLengthModal;