import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Button from '../../elements/CustomButton/CustomButton';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import PersistentMenuField from './PersistentMenuField';
export const TOP_LAYER_LIMIT_MENU = 3;
export const LOW_LAYER_LIMIT_MENU = 5;
export const PERSISTENT_MENU_LIMIT_DEPT = 3;
export const BTN_ACTION_ADD_PARENT_MENU = '@addParentPersistentMenu';
export const BTN_ACTION_ADD_NESTED_MENU = '@addNestedPersistentMenu';
export const BTN_ACTION_REMOVE_MENU = '@removePersistentMenu';
export const BTN_ACTION_CANCEL_FORM = '@cancelForm';
export const BTN_ACTION_SUBMIT_FORM = '@submitForm';
UIkit.use(Icons);
class BotCreationForm extends Component {
    constructor(props) {
        super(props);
        this.dom = {};
        this.state = {
            persistentMenuElements: [{
                locale: 'default',
                composer_input_disabled: false,
                call_to_actions: []
            }]
        }
    }
    componentDidMount() {
        
    }
    componentWillUpdate(){
        console.log("componentWillUpdate",this.state);
    }
    componentDidUpdate(){
        console.log("componentDidUpdate",this.state);
    }
    componentWillUnmount() {
        console.log("componentWillUnmount",this.state);
    }
    componentWillReceiveProps(props){
        console.log("componentWillReceiveProps => Props",props);
        console.log("componentWillReceiveProps => State",this.state);
    }
    shouldComponentUpdate(props){
        console.log("shouldComponentUpdate => Props",props);
        console.log("shouldComponentUpdate => State",this.state);
        return true;
    }
    removePersistentMenuField = (event) => {
        this.setState((previous) => ({
            persistentMenuElements: previous.persistentMenuElements.concat()
        }))
        // window.$(event.target).parents('.persistent-menu-outter')[0].remove();
    }
    addPersistentMenuInputField = (event) => {
        event.preventDefault();
        let target = event.target;
        switch(target.getAttribute("data-btn-action")) {
            case BTN_ACTION_ADD_PARENT_MENU:
                let menu_struct = {
                    title: "",
                    type: "postback",
                    payload: ""
                }
                if (this.state.persistentMenuElements[0].call_to_actions.length < 3) {
                    this.setState((previous) => ({
                        persistentMenuElements: previous.persistentMenuElements[0].call_to_actions.concat(menu_struct)
                    }))
                }
                break;
            default:
                break;
        }
        
    }
    
    render() {
        return (
            <div id="bot-creation-form" className="uk-flex-top" data-uk-modal>
                <div className="uk-modal-dialog uk-margin-auto-vertical">
                    <button className="uk-modal-close-default" type="button" data-uk-close></button>
                    <div className="uk-modal-header">
                        <h2 className="uk-modal-title uk-text-center">Create Messenger Bot</h2>
                    </div>
                    <div className="uk-modal-body" data-uk-overflow-auto>
                        <div className="form-wrapper">
                            <div className="uk-margin">
                                <div className="uk-form-controls">
                                    <div className="uk-inline uk-flex">
                                        <button className="uk-form-icon" data-uk-tooltip="title:just a bot display name, which is read only on dashboard;delay:400;pos:right;ratio:0.6" data-uk-icon="icon: info"></button>
                                        <input placeholder="Display name ..." className="uk-input" type="text" name="title"/>
                                    </div>
                                </div>
                            </div>
                            <div className="uk-margin">
                                <div className="uk-form-controls">
                                    <div className="uk-inline uk-flex">
                                        <button className="uk-form-icon" data-uk-tooltip="title:a message which will reply back to user after first interact through messenger;delay:400;pos:right;ratio:0.6" data-uk-icon="icon: info"></button>
                                        <input placeholder="Welcome message" className="uk-input" type="text" name="get_started"/>
                                    </div>
                                </div>
                            </div>
                            <div className="uk-margin">
                                <div className="uk-form-controls">
                                    <div className="uk-inline uk-flex">
                                        <button className="uk-form-icon" data-uk-tooltip="title:Greeting message people will see on the welcome screen of your bot;delay:400;pos:right;ratio:0.6" data-uk-icon="icon: info"></button>
                                        <input placeholder="Greeting message" className="uk-input" type="text" name="greeting"/>
                                    </div>
                                </div>
                            </div>
                            <fieldset className="uk-fieldset">
                                <div className="uk-legend">
                                    Persistent menu
                                </div>
                                <div ref={(element)=>{this.persistentMenuWrapperDiv = element}} id="persistentMenuWrapperDiv" className="uk-margin">
                                    {
                                        this.state.persistentMenuElements[0].call_to_actions.map((element, index) => {
                                            return (
                                                <PersistentMenuField 
                                                    className="uk-margin-small" 
                                                    key={`${'persistent_menu_field_'+index}`} 
                                                    title={element.title} 
                                                    payload={element.payload}
                                                />
                                            )
                                        })
                                    }
                                </div>
                                <div className="uk-margin">
                                    <Button data-btn-action={BTN_ACTION_ADD_PARENT_MENU} onClick={this.addPersistentMenuInputField} bsStyle="success" bsSize="sm" fill>
                                        <span data-uk-icon="icon:plus-circle;"></span>
                                        &nbsp;&nbsp;
                                        Add menu
                                    </Button>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="uk-modal-footer uk-text-right">
                        <button data-btn-action="cancel" className="uk-button uk-button-default uk-modal-close" type="button">
                            Cancel
                        </button>
                        <button data-btn-action="create" className="uk-button uk-button-primary" type="button">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default BotCreationForm;