import React, { Component } from 'react';
import reactTriggerChange from 'react-trigger-change';
import Button from '../../elements/CustomButton/CustomButton';
import {Alert} from 'react-bootstrap';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import PersistentMenuField from './PersistentMenuField';
import ISO3166CountryCode from '../../iso3166_countries_code.json';
import Modal from 'react-modal';
export const TOP_LAYER_LIMIT_MENU = 3;
export const LOW_LAYER_LIMIT_MENU = 5;
export const PERSISTENT_MENU_LIMIT_DEPT = 2;
export const BTN_ACTION_ADD_PARENT_MENU = '@addParentPersistentMenu';
export const BTN_ACTION_ADD_NESTED_MENU = '@addNestedPersistentMenu';
export const BTN_ACTION_REMOVE_MENU = '@removePersistentMenu';
export const BTN_ACTION_CANCEL_FORM = '@cancelForm';
export const BTN_ACTION_SUBMIT_FORM = '@submitForm';
let menu_struct = {
    title: "",
    type: "postback",
    payload: ""
}
const customStyles = {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    zIndex               : 9999
};
Modal.setAppElement('#root')
UIkit.use(Icons);
class BotCreationForm extends Component {
    constructor(props) {
        super(props);
        this.dom = {};
        this.errors = [];
        this.state = {
            form_data: {
                messenger: {
                    persistent_menu: [{
                        locale: 'default',
                        composer_input_disabled: false,
                        call_to_actions: []
                    }],
                    get_started: {
                        payload: ""
                    },
                    greeting: [],
                    target_audience: {
                        audience_type: "all"
                    },
                    // whitelisted_domains: [],
                    // payment_settings: {
                    //     privacy_url: "",
                    //     public_key: "",
                    //     testers: []
                    // },
                    // home_url: {
                    //     url: "",
                    //     webview_share_button: "show",
                    //     webview_height_ratio: "tall",
                    //     in_test: true
                    // },
                    // account_linking_url: ""
                },
                server: {
                    title: "",
                    page_uuid: "",
                    access_token: "",
                    long_lived_access_token: "",
                    is_switched_on: true
                },
                user: {
                    id: "",
                    access_token: "",
                }
            },
            fb: {
                status: 'unknown',
                page: {
                    status: false,
                    data: []
                }
            }
        }
    }

    componentDidMount() {
        this.checkLoginStatus();
    }
    componentDidUpdate(prevProps, prevState) {
        console.log("componentDidUpdate STATE : ",this.state);
        console.log("componentDidUpdate PROPS : ",this.props);
    }
    componentWillUnmount() {
        console.log("componentWillUnmount",this.state);
    }
    checkLoginStatus = () => {
        window.FB.getLoginStatus(response => this.statusChangeCallback(response))
    }
    statusChangeCallback = (response) => {
        console.log("AUTH RESPONSE", response);
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            this.setState(({fb, form_data}) => ({
                fb: {
                    ...fb,
                    ...response

                },
                form_data: {
                    ...form_data,
                    user: {
                        access_token: response.authResponse.accessToken,
                        id: response.authResponse.userID
                    }
                }
            }))
            this.getPages();
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            this.fbConnectBtnInner.innerHTML = 'Please connect with this app.';
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            this.fbConnectBtnInner.innerHTML = 'Please log into Facebook.';
        }
    }
    getPages = () => {
        var self = this;
        window.FB.api('/me/accounts', (response) => {
            self.setState(({fb})=>({
                fb: {
                    ...fb,
                    page: {
                        data: response.data,
                        status: true
                    }
                }
            }));
            self.facebookPageSelectize[0].selectize.clearOptions();
            self.facebookPageSelectize[0].selectize.addOption(response.data);
            self.facebookPageSelectize[0].selectize.refreshOptions();
        });
    }
    onFacebookLogin = () => {
        var permissionScopes = [
            'email',
            'public_profile',
            'user_events',
            'user_managed_groups',
            'publish_actions',
            'manage_pages',
            'pages_show_list',
            'read_page_mailboxes',
            // 'pages_messaging',
            // 'pages_messaging_phone_number',
            // 'pages_messaging_subscriptions',
            'user_friends',
            // 'read_insights',
            // 'pages_manage_cta'

        ];
        window.FB.login(response => {
                this.statusChangeCallback(response);
            },
            { scope: permissionScopes.join(",")}
        )
    }
    setUpSelectize = () => {
        var self = this;
        this.targetAudienceCountrySelectize = window.$("#target_audience_countries").selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            maxItems: null,
            valueField: 'alpha-2',
            labelField: 'name',
            searchField: ['name'],
            options: ISO3166CountryCode,
            placeholder: "Add whitelist countries",
            create: false,
            onChange: function(value){
                reactTriggerChange(self.targetAudienceCountryInput);
            }
        });
        this.facebookPageSelectize = window.$("#page_uuid").selectize({
            valueField: 'id',
            labelField: 'name',
            searchField: ['name'],
            placeholder: "Select page",
            options: [],
            create: false,
            onChange: function(value){
                reactTriggerChange(self.pageUUIDInput);
            }
        });

    }
    onChangeAudienceType = (event) => {
        event.persist()
        var value = window.$("#target_audience_countries").attr('value');
        console.log("RADIO CHANGED");
        this.setState(({form_data}) => {
            if(event.target.value === 'custom'){
                return {
                    form_data: {
                        ...form_data,
                        messenger: {
                            ...form_data.messenger,
                            target_audience: Object.assign({}, form_data.messenger.target_audience, {
                                audience_type: 'custom',
                                countries: {
                                    whitelist: value.split(',')
                                }
                            }),
                        }
                    }
                }
            } else {
                var obj = Object.assign({}, form_data.messenger.target_audience, {
                    audience_type: event.target.value
                });
                if(obj.hasOwnProperty('countries')){
                    delete obj.countries
                }
                return {
                    form_data: {
                        ...form_data,
                        messenger: {
                            ...form_data.messenger,
                            target_audience: obj
                        }

                    }
                }
            }
        })
    }
    removePersistentMenuField = (event) => {
        let target = event.currentTarget;
        let parent = window.$(target).parents('.persistent-menu-outter')[0];
        let parentOrder = window.$(parent).attr('data-order');
        let parentDepth = parseInt(window.$(parent).attr('data-depth'), 10);
        let hierarchyOrder;
        switch(parentDepth){
            case 0:
                this.setState(({form_data}) => ({
                    form_data: {
                        ...form_data,
                        messenger: {
                            ...form_data.messenger,
                            persistent_menu: form_data.messenger.persistent_menu.map((localeMenu, localeMenuIndex) => {
                                if(localeMenuIndex === 0) {
                                    var filterMenu = localeMenu.call_to_actions.filter((item, i) => {
                                        return i !== parseInt(parentOrder, 10)
                                    });
                                    return {
                                        ...localeMenu,
                                        call_to_actions: filterMenu
                                    }
                                }
                                return localeMenu;
                            })
                        }
                    }
                }))
                break;
            case 1:
                hierarchyOrder = parentOrder.split("_");
                this.setState(({form_data}) => ({
                    form_data: {
                        ...form_data,
                        messenger: {
                            ...form_data.messenger,
                            persistent_menu: form_data.messenger.persistent_menu.map((localeMenu, localeMenuIndex) => {
                                if(localeMenuIndex === 0) {
                                    return {
                                        ...localeMenu,
                                        call_to_actions: localeMenu.call_to_actions.map((parentMenuItem, parentIndex) => {
                                            if(parentIndex === parseInt(hierarchyOrder[0], 10)) {
                                                var filterMenu = parentMenuItem.call_to_actions.filter((item, i) => {
                                                    return i !== parseInt(hierarchyOrder[1], 10)
                                                });
                                                if(filterMenu.length === 0){
                                                    var menu_obj = Object.assign({}, parentMenuItem, {type: "postback", payload: ""})
                                                    delete menu_obj.call_to_actions;
                                                    return menu_obj
                                                }
                                                return {
                                                    ...parentMenuItem,
                                                    call_to_actions: filterMenu
                                                }
                                            }
                                            return parentMenuItem;
                                        })
                                    }
                                }
                                return localeMenu;
                            })
                        }
                    }
                }))
                break;
            case 2:
                hierarchyOrder = parentOrder.split("_");
                this.setState(({form_data}) => ({
                    form_data: {
                        ...form_data,
                        messenger: {
                            ...form_data.messenger,
                            persistent_menu: form_data.messenger.persistent_menu.map((localeMenu, localeMenuIndex) => {
                                if(localeMenuIndex === 0) {
                                    return {
                                        ...localeMenu,
                                        call_to_actions: localeMenu.call_to_actions.map((parentMenuItem, parentIndex) => {
                                            if(parentIndex === parseInt(hierarchyOrder[0], 10)) {
                                                return {
                                                    ...parentMenuItem,
                                                    call_to_actions: parentMenuItem.call_to_actions.map((secondDepthMenu, secondDeptIndex) => {
                                                        if(secondDeptIndex === parseInt(hierarchyOrder[1], 10)) {
                                                            var filterMenu = secondDepthMenu.call_to_actions.filter((item, i) => {
                                                                return i !== parseInt(hierarchyOrder[2], 10)
                                                            });
                                                            if(filterMenu.length === 0){
                                                                var menu_obj = Object.assign({}, secondDepthMenu, {type: "postback", payload: ""})
                                                                delete menu_obj.call_to_actions;
                                                                return menu_obj
                                                            }
                                                            return {
                                                                ...secondDepthMenu,
                                                                call_to_actions: filterMenu
                                                            }
                                                        }
                                                        return secondDepthMenu;
                                                    })
                                                }
                                            }
                                            return parentMenuItem;
                                        })
                                    }
                                }
                                return localeMenu;
                            })
                        }
                    }
                }))
                break;
            default:
                break;
        }
    }
    addPersistentMenuInputField = (event) => {
        event.preventDefault();
        let target = event.currentTarget;
        switch(target.getAttribute("data-btn-action")) {
            case BTN_ACTION_ADD_PARENT_MENU:
                if (this.state.form_data.messenger.persistent_menu[0].call_to_actions.length < TOP_LAYER_LIMIT_MENU) {
                    let menu_obj = Object.assign({}, menu_struct)
                    this.setState(({form_data}) => ({
                        form_data: {
                            ...form_data,
                            messenger: {
                                ...form_data.messenger,
                                persistent_menu: form_data.messenger.persistent_menu.map((localeMenu, index) => {
                                    if (index === 0) {
                                        return {
                                            ...localeMenu,
                                            call_to_actions: localeMenu.call_to_actions.concat(menu_obj)
                                        }
                                    }
                                    return localeMenu
                                })
                            }
                        }
                    }));

                }
                break;
            case BTN_ACTION_ADD_NESTED_MENU:
                let parent = window.$(target).parents('.persistent-menu-outter')[0];
                let parentOrder = window.$(parent).attr('data-order');
                let parentDepth = parseInt(window.$(parent).attr('data-depth'), 10);
                if(parentDepth < PERSISTENT_MENU_LIMIT_DEPT) {
                    this.setState(({form_data}) => ({
                        form_data: {
                            ...form_data,
                            messenger: {
                                ...form_data.messenger,
                                persistent_menu: form_data.messenger.persistent_menu.map((localeMenu, index) => {
                                    if(index === 0) {
                                        return {
                                            ...localeMenu,
                                            call_to_actions: localeMenu.call_to_actions.map((parentMenuItem, parentIndex) => {

                                                if (parentDepth===0) {
                                                    if (parentIndex === parseInt(parentOrder.split('_')[0], 10)) {
                                                        if(parentMenuItem.hasOwnProperty('call_to_actions')) {
                                                            if (parentMenuItem.call_to_actions.length < LOW_LAYER_LIMIT_MENU) {
                                                                return {
                                                                    ...parentMenuItem,
                                                                    call_to_actions: parentMenuItem.call_to_actions.concat(menu_struct)
                                                                }
                                                            }
                                                            return parentMenuItem;
                                                        } else {
                                                            let menu_obj = Object.assign({}, parentMenuItem, {
                                                                type: 'nested',
                                                                call_to_actions: [menu_struct]
                                                            });
                                                            delete menu_obj.payload;
                                                            return menu_obj;
                                                        }
                                                    } else {
                                                        return parentMenuItem
                                                    }
                                                } else if (parentDepth===1) {
                                                    if(parentIndex === parseInt(parentOrder.split('_')[0], 10)) {
                                                        return {
                                                            ...parentMenuItem,
                                                            call_to_actions: parentMenuItem.call_to_actions.map((secondDepthMenu, secondDeptIndex) => {
                                                                if (secondDeptIndex === parseInt(parentOrder.split('_')[1], 10)) {
                                                                    if(secondDepthMenu.hasOwnProperty('call_to_actions')) {
                                                                        if (secondDepthMenu.call_to_actions.length < LOW_LAYER_LIMIT_MENU) {
                                                                            return {
                                                                                ...secondDepthMenu,
                                                                                call_to_actions: secondDepthMenu.call_to_actions.concat(menu_struct)
                                                                            }
                                                                        }
                                                                        return secondDepthMenu;
                                                                    } else {
                                                                        let menu_obj = Object.assign({}, secondDepthMenu, {
                                                                            type: 'nested',
                                                                            call_to_actions: [menu_struct]
                                                                        });
                                                                        delete menu_obj.payload;
                                                                        return menu_obj;
                                                                    }
                                                                }
                                                                return secondDepthMenu;
                                                            })
                                                        }
                                                    }
                                                    return parentMenuItem
                                                }
                                                return parentMenuItem;
                                            })
                                        }
                                    }
                                    return localeMenu;
                                })
                            }
                        }
                    }))
                }

                break;
            default:
                break;
        }

    }
    onChangeValue = (event) => {
        var target = event.target;
        var value = target.value;
        var name = target.name;
        var dataInputName = target.getAttribute('data-input-name');
        let parent = window.$(target).parents('.persistent-menu-outter')[0];
        let parentOrder = window.$(parent).attr('data-order');
        let parentDepth = parseInt(window.$(parent).attr('data-depth'), 10);
        console.log(dataInputName, value, target, name);
        this.setState(({form_data}) => {
            switch(dataInputName) {
                case 'persistent_menu':
                    return {
                        form_data: {
                            ...form_data,
                            messenger: {
                                ...form_data.messenger,
                                persistent_menu: form_data.messenger.persistent_menu.map((localeMenu, index) => {
                                    if (index===0) {
                                        if(parentDepth===0) {
                                            return {
                                                ...localeMenu,
                                                call_to_actions: localeMenu.call_to_actions.map((parentMenu, parentIndex) => {
                                                    if (parentIndex === parseInt(parentOrder.split('_')[0], 10)) {
                                                        return {
                                                            ...parentMenu,
                                                            [name]: value
                                                        }
                                                    }
                                                    return parentMenu
                                                })
                                            }
                                        } else if(parentDepth===1) {
                                            return {
                                                ...localeMenu,
                                                call_to_actions: localeMenu.call_to_actions.map((parentMenu, parentIndex) => {
                                                    if(parentIndex === parseInt(parentOrder.split('_')[0], 10)) {
                                                        return {
                                                            ...parentMenu,
                                                            call_to_actions: parentMenu.call_to_actions.map((secondDeptMenu, secondDeptIndex) => {
                                                                if(secondDeptIndex === parseInt(parentOrder.split('_')[1], 10)) {
                                                                    return {
                                                                        ...secondDeptMenu,
                                                                        [name]: value
                                                                    }
                                                                }
                                                                return secondDeptMenu
                                                            })
                                                        }
                                                    }
                                                    return parentMenu
                                                })
                                            }
                                        } else if(parentDepth===2) {
                                            return {
                                                ...localeMenu,
                                                call_to_actions: localeMenu.call_to_actions.map((parentMenu, parentIndex) => {
                                                    if(parentIndex === parseInt(parentOrder.split('_')[0], 10)) {
                                                        return {
                                                            ...parentMenu,
                                                            call_to_actions: parentMenu.call_to_actions.map((secondDeptMenu, secondDeptIndex) => {
                                                                if (secondDeptIndex === parseInt(parentOrder.split('_')[1], 10)) {
                                                                    return {
                                                                        ...secondDeptMenu,
                                                                        call_to_actions: secondDeptMenu.call_to_actions.map((thirdDeptMenu, thirdDeptIndex) => {
                                                                            if(thirdDeptIndex === parseInt(parentOrder.split('_')[2], 10)) {
                                                                                return {
                                                                                    ...thirdDeptMenu,
                                                                                    [name]: value
                                                                                }
                                                                            }
                                                                            return thirdDeptMenu
                                                                        })
                                                                    }
                                                                }
                                                                return secondDeptMenu
                                                            })
                                                        }
                                                    }
                                                    return parentMenu
                                                })
                                            }
                                        }
                                    }
                                    return localeMenu
                                })
                            }
                        }
                    }
                case 'target_audience_countries':
                    return {
                        form_data: {
                            ...form_data,
                            messenger: {
                                ...form_data.messenger,
                                target_audience: {
                                    ...form_data.messenger.target_audience,
                                    countries: {
                                        whitelist: value.split(',')
                                    }
                                }
                            }
                        }
                    }
                case 'display_name':
                    return {
                        form_data: {
                            ...form_data,
                            server: {
                                ...form_data.server,
                                [name]: value
                            }
                        }
                    }
                case 'get_started':
                    return {
                        form_data: {
                            ...form_data,
                            messenger: {
                                ...form_data.messenger,
                                [name]: {
                                    payload: value
                                }
                            }
                        }
                    }
                case 'greeting':
                    return {
                        form_data: {
                            ...form_data,
                            messenger: {
                                ...form_data.messenger,
                                [name]: [
                                    {
                                        locale: "default",
                                        text: value
                                    }
                                ]
                            }
                        }
                    }
                case 'composer_input_disabled':
                    return {
                        form_data: {
                            ...form_data,
                            messenger: {
                                ...form_data.messenger,
                                persistent_menu: form_data.messenger.persistent_menu.map((localeMenu, localeIndex) => {
                                    if(localeIndex === 0){
                                        return {
                                            ...localeMenu,
                                            [name]: target.checked
                                        }
                                    }
                                    return localeMenu
                                })
                            }
                        }
                    }
                case 'page_uuid':
                    return {
                        form_data: {
                            ...form_data,
                            server: {
                                ...form_data.server,
                                [name]: value
                            }
                        }
                    }
                default:
                    return {
                        form_data: {
                            ...form_data
                        }
                    }
            }
        })
    }
    onSubmitForm = (event) => {
        event.preventDefault();
        this.props.onSubmitForm(this.state.form_data);
    }
    onCancelForm = (event) => {
        event.preventDefault();
    }
    
    render() {
        return (
            <Modal
                ref={(modal) => {this.dom.formModal = modal}}
                className="uk-flex uk-flex-middle uk-height-1-1 uk-modal"
                isOpen={true}
                onRequestClose={this.props.onCloseCreationForm}
                style={customStyles}
                contentLabel="Example Modal"
            >

                <div className="custom-modal-dialog" id="bot-creation-form">
                    <button className="uk-modal-close-default" onClick={this.props.onCloseCreationForm} data-uk-icon="icon:close"></button>
                    <div className="uk-modal-header">
                        <h2 className="uk-modal-title uk-text-center">Create Messenger Bot</h2>
                    </div>
                    <div className="uk-modal-body" data-uk-overflow-auto>
                        <div className="errors-wrapper">
                            
                        </div>
                        <div className="form-wrapper">
                            <div className="uk-margin">
                                <div className="uk-form-controls">
                                    <div className="uk-inline uk-flex">
                                        <button className="uk-form-icon" data-uk-tooltip="title:just a bot display name, which is read only on dashboard;delay:400;pos:right;ratio:0.6" data-uk-icon="icon: info"></button>
                                        <input onChange={this.onChangeValue} placeholder="Display name" className="uk-input" type="text" name="title" data-input-name="display_name"/>
                                    </div>
                                </div>
                            </div>
                            <div className="uk-margin">
                                <div className="uk-form-controls">
                                    <div className="uk-inline uk-flex">
                                        <button className="uk-form-icon" data-uk-tooltip="title:a message which will reply back to user after first interact through messenger;delay:400;pos:right;ratio:0.6" data-uk-icon="icon: info"></button>
                                        <input onChange={this.onChangeValue} placeholder="Welcome message" className="uk-input" type="text" name="get_started" data-input-name="get_started"/>
                                    </div>
                                </div>
                            </div>
                            <div className="uk-margin">
                                <div className="uk-form-controls">
                                    <div className="uk-inline uk-flex">
                                        <button className="uk-form-icon" data-uk-tooltip="title:Greeting message people will see on the welcome screen of your bot;delay:400;pos:right;ratio:0.6" data-uk-icon="icon: info"></button>
                                        <input onChange={this.onChangeValue} placeholder="Greeting message" className="uk-input" type="text" name="greeting" data-input-name="greeting"/>
                                    </div>
                                </div>
                            </div>
                            <fieldset className="uk-fieldset bot-target-audience">
                                <div className="uk-legend">
                                    <h4>
                                        Target audience
                                        <span className="inline-tooltip" data-uk-tooltip="title:Target Audience allows you to customize the audience that will see your bot in the Discover tab on Messenger. Other users can still find and use your bot through other channels (e.g. search, m.me URL).;delay:400;pos:right;ratio:0.6" data-uk-icon="icon: info"></span>
                                    </h4>
                                </div>
                                <div className="uk-margin">
                                    <div className="uk-grid-small uk-grid-divider uk-child-width-1-3" data-uk-grid>
                                        <div className="uk-form-controls">
                                            <input id="audience_type_none" name="audience_type" type="radio" className="uk-radio" value="none" checked={this.state.form_data.messenger.target_audience.audience_type === 'none'} onChange={this.onChangeAudienceType}/>
                                            <label htmlFor="audience_type_none" className="uk-form-label">None</label>
                                        </div>
                                        <div className="uk-form-controls">
                                            <input id="audience_type_all" name="audience_type" type="radio" className="uk-radio" value="all" checked={this.state.form_data.messenger.target_audience.audience_type === 'all'} onChange={this.onChangeAudienceType}/>
                                            <label htmlFor="audience_type_all" className="uk-form-label">All</label>
                                        </div>
                                        <div className="uk-form-controls">
                                            <input id="audience_type_custom" name="audience_type" type="radio" className="uk-radio" value="custom" checked={this.state.form_data.messenger.target_audience.audience_type === 'custom'} onChange={this.onChangeAudienceType}/>
                                            <label htmlFor="audience_type_custom" className="uk-form-label">Custom</label>
                                        </div>
                                    </div>

                                    <div className={this.state.form_data.messenger.target_audience.audience_type === 'custom' ? 'uk-margin' : 'uk-hidden'}>
                                        <input onChange={this.onChangeValue} ref={(input) => {this.targetAudienceCountryInput = input}} id="target_audience_countries" type="text" name="target_audience_countries" data-input-name="target_audience_countries" value=""/>
                                    </div>
                                    
                                </div>
                            </fieldset>
                            <fieldset className="uk-fieldset bot-persistent-menu">
                                <div className="uk-legend">
                                    <h4>
                                        Persistent menu
                                        <span className="inline-tooltip" data-uk-tooltip="title:The persistent menu can be set for your bot to help people discover and more easily access your functionality throughout the conversation.;delay:400;pos:right;ratio:0.6" data-uk-icon="icon: info"></span>
                                    </h4>
                                </div>
                                {
                                    this.state.form_data.messenger.persistent_menu[0].call_to_actions.length > 0 &&
                                    <div className="uk-margin">
                                        <div className="uk-form-controls">
                                            <input onChange={this.onChangeValue} id="composer_input_disabled" className="uk-checkbox" type="checkbox" name="composer_input_disabled" data-input-name="composer_input_disabled"/>
                                            <label htmlFor="composer_input_disabled" className="uk-form-label" checked={this.state.form_data.messenger.persistent_menu[0].composer_input_disabled}>
                                                Disable messenger text input
                                            </label>
                                        </div>
                                    </div>

                                }
                                <div ref={(element)=>{this.persistentMenuWrapperDiv = element}} id="persistentMenuWrapperDiv" className="uk-margin">
                                    {
                                        this.state.form_data.messenger.persistent_menu[0].call_to_actions.map((element, index) => {
                                            return (
                                                <PersistentMenuField
                                                    key={`${'persistent_menu_field_'+index}`}
                                                    depth={0}
                                                    order={`${index}`}
                                                    orderNumber={index}
                                                    title={element.title}
                                                    payload={element.payload}
                                                    removePersistentMenuField={this.removePersistentMenuField}
                                                    onChangeValue={this.onChangeValue}
                                                    addPersistentMenuInputField={element.call_to_actions && element.call_to_actions.length >= LOW_LAYER_LIMIT_MENU ? false :this.addPersistentMenuInputField}
                                                >
                                                    {
                                                        element.call_to_actions &&
                                                        element.call_to_actions.map((childMenuItem, childMenuIndex) => {
                                                            return (
                                                                <PersistentMenuField
                                                                    key={`${'persistent_menu_field_'+index+'_'+childMenuIndex}`}
                                                                    depth={1}
                                                                    order={`${index+'_'+childMenuIndex}`}
                                                                    orderNumber={childMenuIndex}
                                                                    title={childMenuItem.title}
                                                                    removePersistentMenuField={this.removePersistentMenuField}
                                                                    onChangeValue={this.onChangeValue}
                                                                    addPersistentMenuInputField={childMenuItem.call_to_actions && childMenuItem.call_to_actions.length >= LOW_LAYER_LIMIT_MENU ? false :this.addPersistentMenuInputField}
                                                                >
                                                                    {
                                                                        childMenuItem.call_to_actions &&
                                                                        childMenuItem.call_to_actions.map((secondDeptElement, secondDeptIndex) => {

                                                                            return (
                                                                                <PersistentMenuField
                                                                                    key={`${'persistent_menu_field_'+index+'_'+childMenuIndex+'_'+secondDeptIndex}`}
                                                                                    depth={2}
                                                                                    order={`${index+'_'+childMenuIndex+'_'+secondDeptIndex}`}
                                                                                    orderNumber={secondDeptIndex}
                                                                                    title={secondDeptElement.title}
                                                                                    payload={secondDeptElement.payload}
                                                                                    totalChildren={childMenuItem.call_to_actions.length}
                                                                                    removePersistentMenuField={this.removePersistentMenuField}
                                                                                    onChangeValue={this.onChangeValue}
                                                                                    addPersistentMenuInputField={false}
                                                                                />
                                                                            )
                                                                        })
                                                                    }
                                                                </PersistentMenuField>
                                                            )
                                                        })
                                                    }
                                                </PersistentMenuField>
                                            )
                                        })
                                    }
                                </div>
                                <div
                                    className={
                                        `uk-margin ${
                                            this.state.form_data.messenger.persistent_menu[0].call_to_actions.length >= TOP_LAYER_LIMIT_MENU ? 'uk-hidden': ''
                                        }`
                                    }>
                                    <Button data-btn-action={BTN_ACTION_ADD_PARENT_MENU} onClick={this.addPersistentMenuInputField} bsStyle="success" bsSize="sm" fill>
                                        <span data-uk-icon="icon:plus-circle;"></span>
                                        &nbsp;&nbsp;
                                        Add menu
                                    </Button>
                                </div>
                            </fieldset>
                            <fieldset className="uk-fieldset connect-facebook-page">
                                <div className="uk-legend">
                                    <h4>
                                        Connect facebook page
                                        <span className="inline-tooltip" data-uk-tooltip="title:connect facebook page to the bot you're going to create.;delay:400;pos:right" data-uk-icon="icon: info"></span>
                                    </h4>
                                </div>
                                <div className="uk-margin">
                                    <div className={this.state.fb.page.status ? 'uk-margin' : 'uk-hidden'}>
                                        <select onChange={this.onChangeValue} ref={(input) => {this.pageUUIDInput = input}} id="page_uuid" name="page_uuid" data-input-name="page_uuid"/>
                                    </div>
                                    {
                                        this.state.fb.status === 'connected' ? '' : 
                                        <Button onClick={this.onFacebookLogin} bsStyle="success" bsSize="sm" fill>
                                            <span data-uk-icon="icon:plus-circle;"></span>
                                            &nbsp;&nbsp;
                                            <span ref={(btn) => {this.fbConnectBtnInner = btn}}>Connect Facebook</span>
                                        </Button>
                                    }
                                    
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="uk-modal-footer uk-text-right">
                        <button data-btn-action="cancel" onClick={this.onCancelForm} className="uk-button uk-button-default uk-modal-close" type="button">
                            Cancel
                        </button>
                        <button data-btn-action="create" onClick={this.onSubmitForm} className="uk-button uk-button-primary" type="button">
                            Save
                        </button>
                    </div>
                </div>
                {
                    this.setUpSelectize()
                }                    
            </Modal>
        );
    }
}

export default BotCreationForm;
