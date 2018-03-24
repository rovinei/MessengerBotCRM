import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {SyncLoader} from 'react-spinners';
import FormInputs from './FormInputs/FormInputs';
import { Alert } from 'react-bootstrap';
import logo from '../assets/img/logo_chat.png';
export default class LoginForm extends Component {
	state = {
		username: "",
        password: ""
    };
    componentDidMount() {
        ReactDOM.findDOMNode(this.usernameInput).addEventListener('change', this.handleInputChange);
        ReactDOM.findDOMNode(this.passwordInput).addEventListener('change', this.handleInputChange);
    }
    componentWillUnmount() {
        ReactDOM.findDOMNode(this.usernameInput).removeEventListener('change', this.handleInputChange);
        ReactDOM.findDOMNode(this.passwordInput).removeEventListener('change', this.handleInputChange);
    }
	handleInputChange = event => {
		const target = event.target,
			value = target.value,
            name = target.name;
		this.setState({
			[name]: value
		});
	};
	onSubmit = event => {
        event.preventDefault();
		this.props.onSubmit(this.state.username, this.state.password);
	};
	render() {
		const errors = this.props.errors || {};
		return (
			<div className="form-container uk-flex uk-flex-middle uk-flex-center">
                {
                    this.props.loading && 
                    <div className="loading-wrapper active">
                        <SyncLoader
                            color={'#1DC7EA'}
                            loading={true}
                        />
                    </div>
                }
                <div className="form-wrapper uk-width-1-1">
                    <form onSubmit={this.onSubmit}>
                        <div className="logo-wrapper">
                            <img src={logo} alt="logo"/>
                        </div>
                        <h3 className="form-title uk-text-center">Member Login</h3>
                        {errors.non_field_errors ? (
                            <Alert bsStyle="danger">
                                <button type="button" aria-hidden="true" className="close">×</button>
                                <span>{errors.non_field_errors}</span>
                            </Alert>
                        ) : (
                            ""
                        )}
                        <FormInputs 
                            ref={(username) => { this.usernameInput = username; }}
                            ncols = {["col-xs-12"]}
                            proprieties = {[
                                {
                                    name: "username",
                                    type : "text",
                                    bsClass : "form-control",
                                    placeholder : "username",
                                    defaultValue : "",
                                    disabled : false
                                },
                            ]} 
                        />
                        <FormInputs 
                            ref={(password) => { this.passwordInput = password; }}
                            ncols = {["col-xs-12"]}
                            proprieties = {[
                                {
                                    name: "password",
                                    type : "password",
                                    bsClass : "form-control",
                                    placeholder : "password",
                                    defaultValue : "",
                                    disabled : false
                                },
                            ]}
                        />
                        <div className="top-padding uk-text-center">
                            <button className="login-button">Login</button>
                            <p className="uk-text-center forgot">
                                <span>I forgot my </span>
                                <a href="/dashboard/#/forgot_password">password?</a>
                            </p>
                        </div>
                    </form>
                    <p className="uk-text-center bottom-text">
                        <span>Don't have an account?</span>
                        <a href="/dashboard/#/registration">Sign up</a>
                    </p>
                </div>
			</div>
		);
	}
}
