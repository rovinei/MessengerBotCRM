import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Grid, Row, Col} from 'react-bootstrap';
import {SyncLoader} from 'react-spinners';
import BotCard from '../components/MessengerBot/BotCard';
import BotCreationForm from '../components/MessengerBot/BotCreationForm';
import ISO3166CountryCode from '../iso3166_countries_code.json';
import Card from '../components/Card/Card';
import UIkit from 'uikit';
const modalRoot = document.getElementById('modal-root');
class BotListView extends Component {
    constructor(props){
        super(props);
        this.state = {
            is_showing_form: false
        }
        this.dom = {}
    }
    componentDidMount() {
        this.props.fetchMessengerBots();
    }

    componentWillUnmount() {
    }

    onShowCreationForm = () => {
        this.setState({
            is_showing_form: true
        });
    }

    onCloseCreationForm = () => {
        this.setState({
            is_showing_form: false
        });
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
                <div className="uk-flex">
                    <div className="col-md-3 uk-flex">
                        <Card
                            extraClass={"uk-flex uk-flex-1 uk-flex-center uk-flex-middle"}
                            content={
                                <div className="uk-flex uk-flex-middle uk-flex-center">
                                    <button onClick={this.onShowCreationForm} className="uk-button" id="addBotBtn">
                                       <span className="uk-display-block" data-uk-icon="icon:plus;ratio:2"></span> &nbsp;Add bot
                                    </button>
                                </div>
                            }
                        />
                    </div>
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
                </div>
                {
                    this.state.is_showing_form &&
                    <BotCreationForm
                        onCloseCreationForm={this.onCloseCreationForm}
                        onSubmitForm={this.props.createMessengerBot}
                        formRef={el => this.dom.formRef = el}
                    />
                }

            </Grid>
        );
    }
}

export default BotListView
