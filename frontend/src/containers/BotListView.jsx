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
            <div className="uk-container uk-container-large">
                <div className={
                    this.props.loading ? `${'loading-wrapper active'}` : 'loading-wrapper'
                }>
                    <SyncLoader
                        color={'#1DC7EA'}
                        loading={this.props.loading}
                    />
                </div>
                <div className="uk-flex uk-grid-small uk-child-width-1-1 uk-child-width-1-3@s uk-child-width-1-4@m uk-child-width-1-5@l uk-grid-match" data-uk-grid>
                    <div className="uk-flex">
                        <button onClick={this.onShowCreationForm} className="uk-display-block" id="addBotBtn">
                            <span className="uk-display-block" data-uk-icon="icon:plus;ratio:2"></span>
                            <span className="uk-display-block">Add bot</span>
                        </button>
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
                        errorsMsg={this.props.errors}
                        onCloseCreationForm={this.onCloseCreationForm}
                        onSubmitForm={this.props.createMessengerBot}
                        formRef={el => this.dom.formRef = el}
                    />
                }

            </div>
        );
    }
}

export default BotListView
