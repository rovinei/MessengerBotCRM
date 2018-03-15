import React, { Component } from 'react';
import {Grid, Row} from 'react-bootstrap';
import {SyncLoader} from 'react-spinners';
import BotCard from '../components/MessengerBot/BotCard';

class BotListView extends Component {
    
    componentDidMount() {
        this.props.fetchMessengerBots();
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
            </Grid>
        );
    }
}

export default BotListView