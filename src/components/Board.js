import React from 'react';
import './Board.css';
import Tag from './Tag';
import Cards from './Cards';
import VideoDisplay from "./VideoDisplay";
import { Tab, Row, Nav } from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import fire from '../fire.js';

const db = fire.database();

class Board extends React.Component{

    state ={
        userUID: null,
        isLoading: true, // true if the server is still loading cards data
        visible: true,  // true if cards are visible & false if videos are visible
        show: false, // false if modal is hiden
    }

    componentDidMount() {
        // get references that DON'T change
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    userUID: user.uid,
                })
                console.log("Logged in. UID: " + this.state.userUID);
            } else {
                console.log("you're not logged in.")
            }
        })
    }

    uploadHandler = () => {
        console.log("uploadhandler was clicked");
        const myWidget = window.cloudinary.createUploadWidget({
            cloudName: "respectmegen", 
            tags: ['project'],
            uploadPreset: 'h5awwspl'}, (error, result) => { 
              if (!error && result && result.event === "success") { 
                console.log('Done! Here is the video info: ', result.info);
                console.log("public_id: " + result.info.public_id);
                console.log("userUID in createWidget: " + this.state.userUID);
                
                if (this.state.userUID != null) {
                    // store the id into the current user:
                    var key = db.ref().child('videos').push().key;

                    var updates = {};
                    updates['/videos/' + key] = result.info.public_id;

                    db.ref('User/' + this.state.userUID).update(updates);

                    console.log("video " + result.info.public_id + "added to user " + this.state.userUID);
                
                } else if (this.state.userUID == null) {
                    console.log("video uploaded, but user wasn't logged in.")
                }

              }
            }
          )
        
        // todo: do not open widget if user not logged in!
        myWidget.open();
    }

    // TODO: Replace hardcoded tags (line14~)
    render() {
        return (
            <div className="text-center">
                <h2>COMMUNITY BOARD</h2>
                <h5>What is your community talking about today?</h5>

                <div className="tagGroup">
                    <Tab.Container id="center-tab">
                        <Row id="tag-row">
                            <Nav variant="pills" className="flex-row">
                                <Tag name="study"></Tag>
                                <Tag name="relationship"></Tag>
                                <Tag name="health"></Tag>
                            </Nav>
                        </Row>
                    </Tab.Container>
                    
                </div>

                <ButtonGroup> 
                    <Button variant="light" onClick={()=>{
                        this.setState({ visible: true});
                    }}>
                        Cards
                    </Button>
                    <Button variant="light" onClick={()=>{
                        this.setState({ visible: false});
                    }}>
                        Videos
                    </Button>
                </ButtonGroup>

                { this.state.visible ? <Cards></Cards> : <VideoDisplay></VideoDisplay> }
            </div>
        )}
}

export default Board;