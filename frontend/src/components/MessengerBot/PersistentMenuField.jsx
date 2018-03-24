import React, { Component } from 'react';
import Button from '../../elements/CustomButton/CustomButton';
import {
    BTN_ACTION_ADD_NESTED_MENU,
    BTN_ACTION_REMOVE_MENU
} from './BotCreationForm';

class PersistentMenuField extends Component {
    render() {
        return (
            <div className="uk-form-controls persistent-menu-outter uk-margin-small" data-depth={this.props.depth} data-order={this.props.order} data-order-number={this.props.orderNumber}>
                <div className="uk-flex">
                    <div className="uk-grid-small uk-flex-1" data-uk-grid>

                        <div className="uk-flex-1">
                            <div className="uk-inline uk-flex">
                                <button className="uk-form-icon" data-uk-tooltip="title:Greeting message people will see on the welcome screen of your bot;delay:400;pos:right;ratio:0.6" data-uk-icon="icon: info"></button>
                                <input value={this.props.title} placeholder="Menu title" className="uk-input persistent-menu-title" type="text"/>
                            </div>
                        </div>
                        {
                            this.props.children ? '' : 
                            <div className="uk-flex-1">
                                <div className="uk-inline uk-flex">
                                    <button className="uk-form-icon" data-uk-tooltip="title:postback payload or external url;delay:400;pos:right;ratio:0.6" data-uk-icon="icon: info"></button>
                                    <input value={this.props.payload} placeholder="Words, phrase, url" className="uk-input persistent-menu-value" type="text"/>
                                </div>
                            </div>
                        }
                        

                    </div>
                    {
                        this.props.addPersistentMenuInputField && 
                        <div style={{marginLeft:'5px'}}>
                            <Button onClick={this.props.addPersistentMenuInputField} data-btn-action={BTN_ACTION_ADD_NESTED_MENU} bsStyle="default" fill>
                                <span data-uk-icon="icon:forward"></span>
                            </Button>
                        </div>
                    }
                    <div style={{marginLeft:'5px'}}>
                        <Button onClick={this.props.removePersistentMenuField} data-btn-action={BTN_ACTION_REMOVE_MENU} bsStyle="danger" fill>
                            <span data-uk-icon="icon:trash"></span>
                        </Button>
                    </div>
                </div>
                {
                    this.props.children
                }
            </div>
        );
    }
}

export default PersistentMenuField;