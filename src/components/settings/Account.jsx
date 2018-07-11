import PropTypes from 'prop-types';
import React from 'react';
import {Row, Col, FormGroup, Label} from 'reactstrap';
import _ from 'lodash';

import CustomInputGroup from "../core/CustomInputGroup";
import Button from "../core/Button";
import FieldError from "../core/FieldError";
import Success from "../core/Success";

export default class Account extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        errors: PropTypes.object,
        ProfileActions: PropTypes.object,
    };

    constructor(props) {
        super(props);
        const {user} = props;
        this.state = {
            email: user.email,
            invoice_email: user.invoice_email || user.email,
            password: '',
            old_password: '',
            new_password1: '',
            new_password2: '',
            saving: '',
            isSaved: ''
        }
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (!_.isEqual(this.props.isSaved, prevProps.isSaved)) {
            console.log('changed');
            let stateChanges = {};
            [
                ['account', {password: ''}],
                ['user', {}],
                ['security', {old_password: '', new_password1: '', new_password2: ''}]
            ].forEach(item => {
                let formName = item[0], formState = item[1] || {};
                if(this.props.isSaved[formName] && !prevProps.isSaved[formName]) {
                    stateChanges = {...stateChanges, ...formState, saving: '', isSaved: this.state.saving};
                }
            });
            if(Object.keys(stateChanges).length > 0) {
                this.setState(stateChanges);
            }
        }
    }

    onChangeValue(key, e) {
        e.preventDefault();
        let newState = {};
        newState[key] = e.target.value;
        this.setState(newState);
    };

    onSave(form, e) {
        e.preventDefault();
        const {user, ProfileActions} = this.props;
        switch (form) {
            case 'invoice':
                ProfileActions.updateAuthUser({invoice_email: this.state.invoice_email});
                break;
            case 'email':
                ProfileActions.updateAccountInfo({email: this.state.email, password: this.state.password});
                break;
            case 'password':
                ProfileActions.updatePassword({old_password: this.state.old_password, new_password1: this.state.new_password1, new_password2: this.state.new_password2});
                break;
            default:
                break;
        }

        this.setState({saving: form, isSaved: ''});
    }

    render() {
        const {user, errors} = this.props;
        return (
            <div className="account-settings">
                {user.is_project_owner?(
                    <form onSubmit={this.onSave.bind(this, 'invoice')}>
                        <h6>Add admin email address for invoices</h6>
                        {this.state.isSaved === 'invoice'?(
                            <Success message="Admin email changed successfully"/>
                        ):null}
                        <Label>Email address</Label>
                        <Row>
                            <Col md="8">
                                <FormGroup>
                                    <CustomInputGroup variant="email"
                                                      value={this.state.invoice_email}
                                                      onChange={this.onChangeValue.bind(this, 'invoice_email')}
                                                      required/>
                                </FormGroup>
                            </Col>
                            <Col className="text-right">
                                <Button type="submit">Save</Button>
                            </Col>
                        </Row>
                    </form>
                ):null}
                <form onSubmit={this.onSave.bind(this, 'password')} className="update-password-form">
                    <h6>Change your password</h6>
                    {this.state.isSaved === 'password'?(
                        <Success message="Password updated successfully"/>
                    ):null}
                    <Label>Old password</Label>
                    {errors.security &&
                    errors.security.old_password ? (
                        <FieldError
                            message={errors.security.old_password}
                        />
                    ) : null}
                    <Row>
                        <Col className="col-input">
                            <FormGroup>
                                <CustomInputGroup variant="password"
                                                  value={this.state.old_password}
                                                  onChange={this.onChangeValue.bind(this, 'old_password')}
                                                  required/>
                            </FormGroup>
                        </Col>
                        <Col/>
                        <Col/>
                    </Row>
                    <Row>
                        <Col className="col-input">
                            <Label>New password</Label>
                            {errors.security &&
                            errors.security.new_password1 ? (
                                <FieldError
                                    message={errors.security.new_password1}
                                />
                            ) : null}
                        </Col>
                        <Col className="col-input">
                            <Label>Confirm password</Label>
                            {errors.security &&
                            errors.security.new_password2 ? (
                                <FieldError
                                    message={errors.security.new_password2}
                                />
                            ) : null}
                        </Col>
                        <Col/>
                    </Row>
                    <Row>
                        <Col className="col-input">
                            <FormGroup>
                                <CustomInputGroup variant="password"
                                                  value={this.state.new_password1}
                                                  onChange={this.onChangeValue.bind(this, 'new_password1')}
                                                  required/>
                            </FormGroup>
                        </Col>
                        <Col className="col-input">
                            <FormGroup>
                                <CustomInputGroup variant="password"
                                                  value={this.state.new_password2}
                                                  onChange={this.onChangeValue.bind(this, 'new_password2')}
                                                  required/>
                            </FormGroup>
                        </Col>
                        <Col className="text-right">
                            <Button type="submit">Save</Button>
                        </Col>
                    </Row>
                </form>
                <form onSubmit={this.onSave.bind(this, 'email')}>
                    <h6>Change email address for your account</h6>
                    {this.state.isSaved === 'email'?(
                        <Success message="Email changed successfully"/>
                    ):null}
                    <Label>New email address</Label>
                    <Row>
                        <Col md="8">
                            <FormGroup>
                                <CustomInputGroup variant="email"
                                                  value={this.state.email}
                                                  onChange={this.onChangeValue.bind(this, 'email')}
                                                  required/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Label>Enter password to save new email address</Label>
                    <Row>
                        <Col md="8">
                            <FormGroup>
                                <CustomInputGroup variant="password"
                                                  value={this.state.password}
                                                  onChange={this.onChangeValue.bind(this, 'password')}
                                                  required/>
                            </FormGroup>
                        </Col>
                        <Col className="text-right">
                            <Button type="submit">Save</Button>
                        </Col>
                    </Row>
                </form>
                <form onSubmit={this.onSave.bind(this, 'deactivate')}>
                    <h6>Deactivate account</h6>
                    <div>
                        <Button type="submit" disabled>Deactivate my account</Button>
                    </div>
                </form>
            </div>
        );
    }
}
