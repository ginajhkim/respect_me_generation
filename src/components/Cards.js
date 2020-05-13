import React from 'react';
import MyCard from './MyCard';
import {CardDeck, Container} from 'react-bootstrap';
import AddComment from './AddComment';
import fire from '../fire'

const dbRef = fire.database().ref();

/**
 * A layout displaying all cards in community.
 */
class Cards extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            cardSelected: "",
            isLoading: true,
            showCards: true, 
            visible: false,
            cards: [],
            tag: ""
        }
    }

    getCards(users){
        let cardCollected = [];
        for (let user in users){
            let cards = users[user].cards
            for (let card in cards){
                cardCollected.push({
                    id: card,
                    background: cards[card].imgOption,
                    text: cards[card].text,
                    comments: cards[card].comments
                });
            }
        }
        this.setState({ 
            cards: cardCollected,
            isLoading: false
        })
    }

    componentDidMount(){
        dbRef.child('User').on('value', snap => {
            const users = snap.val();
            this.getCards(users);
        });
    }

    cardClicked = () => {
        this.setState({visible: true})
      };
    
    hideModal = () => {
        this.setState({visible: false})
    }

    static getDerivedStateFromProps(props, state) {
        return {tag: props.tag}
    }

    getCardOwner = () => {
        let cardOwnerUID;
        dbRef.child('User').on('value', snap => {
            const users = snap.val();
            for (let user in users){
                let cards = users[user].cards
                for (let card in cards){
                    if(card === this.state.cardSelected){
                        cardOwnerUID = user
                    }
                }
            }
        });
        return cardOwnerUID
      };

    /**
     * counts the number of 
     * cardCommentObj: a card comment object stored in user
     */
    countComments = (cardCommentObj) => {
        // count comments under each card
        let cardComment = cardCommentObj;
        let commentNumber = 0;
        if (cardComment != null) {
            // count and increment commentNumber
            for (let count in cardComment) {
                commentNumber++;
            }
        }

        return commentNumber;
    }
    
    sortCards() {
        var users;
        dbRef.child('User').on('value', snap => {
            users = snap.val();
        });
        let cardCollected = [];
        for (let user in users){
            
            let cards = users[user].cards
            if (this.state.tag !== "all") {
                for (let card in cards){

                    let commentNumber = this.countComments(cards[card].comments)

                    if (cards[card].tag === this.state.tag) {
                        cardCollected.push({
                            id: card,
                            background: cards[card].imgOption,
                            text: cards[card].text,
                            comments: cards[card].comments,
                            numComments: commentNumber
                        });
                    } 
                }
            } else if (this.props.tag === "all") {
                for (let card in cards){

                    let commentNumber = this.countComments(cards[card].comments)

                    cardCollected.push({
                        id: card,
                        background: cards[card].imgOption,
                        text: cards[card].text,
                        comments: cards[card].comments,
                        numComments: commentNumber
                    });
                }
            }

        }
        return cardCollected;
    }

    render() {
        return (
            <div>
                {this.state.isLoading ? (
                    <div className="loader">
                    <span className="loader__text">Loading...</span>
                    </div>
                ) : this.state.showCards ?
                    (
                    <Container>
                        <CardDeck className="row row-cols-sm-2 row-cols-md-3">
                        {Array.from(this.sortCards()).map((card)=> 
                            <div>
                            <MyCard
                                key={card.id} 
                                id={card.id} 
                                background={card.background} 
                                text={card.text} 
                                commentCount={card.numComments}
                                onClick={()=>{
                                    this.setState({ visible: true, cardSelected: card.id });
                                }}
                            /> </div>)}
                            {this.state.visible ?
                                <AddComment show={this.state.visible} cardOwnerUID={this.getCardOwner()} cardID={this.state.cardSelected} onHide={() => this.setState({visible: false})}/>
                             : null}
                        </CardDeck>
                    </Container>
                    ) : (
                        <div className="loader">
                        <span className="loader__text">Not Visible</span>
                        </div>
                    )}
            </div>
        )
    }
}

export default Cards;

// // count comments under each card
                    // let cardComment = cards[card].comments;
                    // let commentNumber = 0;
                    // if (cardComment != null) {
                    //     // count and increment commentNumber
                    //     for (let count in cardComment) {
                    //         commentNumber++;
                    //     }
                    // }