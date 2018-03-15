import React, { Component } from "react";
import ReactDOM from 'react-dom';
import Button from 'elements/CustomButton/CustomButton';
import FormInputs from './FormInputs/FormInputs';
import { Alert, Col, Row, Form } from 'react-bootstrap';
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
			<Row>
                <Col lgOffset={5} lg={2} mdOffset={4} md={4} smOffset={4} sm={4} xs={10} xsOffset={1}>
                    <Form horizontal onSubmit={this.onSubmit}>
                        <h3 className="text-center">Authentication</h3>
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
                        <Row className="text-center">
                            <Button type="submit" bsStyle="primary" round>Sign in</Button>
                        </Row>
                    </Form>
                </Col>
			</Row>
		);
	}
}
