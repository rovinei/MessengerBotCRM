import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import {SyncLoader} from 'react-spinners';
import BotCard from '../components/MessengerBot/BotCard';
import BotCreationForm from '../components/MessengerBot/BotCreationForm';
import Card from '../components/Card/Card';
import UIkit from 'uikit';
class BotListView extends Component {
    
    componentDidMount() {
        // this.props.fetchMessengerBots();
    }

    onShowCreationForm = (event) => {
        UIkit.modal("#bot-creation-form").show();
    }

    render() {
        return (
            <Grid fluid>
                <div className={
                    this.props.is_loading ? `${'loading-wrapper active'}` : 'loading-wrapper'
                }>
                    <SyncLoader
                        color={'#1DC7EA'}
                        loading={this.props.is_loading}
                    />
                </div>
                <Row>
                    <Col md={3}>
                        <Card
                            content={
                                <div className="uk-flex uk-flex-middle uk-flex-center">
                                    <button onClick={(e)=>this.onShowCreationForm(e)} className="uk-button" id="addBotBtn">
                                        Add bot
                                    </button>
                                </div>
                            }
                        />
                    </Col>
                    {
                        this.props.bots && this.props.bots.length > 0 &&
                        this.props.bots.map((bot, index) => {
                            return (
                                <BotCard 
                                    key={`${'messenger-bot_'+index}`}
                                    {...bot}
                                />
                            )
                        })
                    }
                </Row>
                <BotCreationForm/>
            </Grid>
        );
    }
}

export default BotListView