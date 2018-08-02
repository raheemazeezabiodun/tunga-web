import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup, Row, Col} from 'reactstrap';

import Input from '../core/InputGroup';
import FieldError from '../core/FieldError';
import IconButton from "../core/IconButton";


export default class StepOne extends React.Component {
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
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            company: user.is_project_owner?user.company.name:user.profile.company || ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isSaved.profile || nextProps.isSaved.company) {
            this.props.history.push('/onboard/step-two');
        }
    }

    onChangeField(key, e) {
        let newState = {};
        newState[key] = e.target.value;
        this.setState(newState);
    }

    onSave(e) {
        e.preventDefault();
        const {user, ProfileActions} = this.props;
        let reqData = {
            user: {
                id: user.id,
                first_name: this.state.first_name,
                last_name: this.state.last_name
            }
        };

        if(user.is_project_owner) {
            // Clients get a company object
            reqData.name = this.state.company;
            ProfileActions.updateCompany(user.company.id, reqData);
        } else {
            // Other users get only a company name
            reqData.company = this.state.company;
            ProfileActions.updateProfile(user.profile.id, reqData);
        }
        return;
    }

    render() {
        const {errors, user} = this.props;

        let errorSource = (user.is_project_owner?errors.company:errors.profile) || {},
            companyField = user.is_project_owner?'name':'company';

        return (
            <div>
                <form onSubmit={this.onSave.bind(this)} className="clearfix">
                    <Row>
                        <Col className="col-main">
                            {errorSource &&
                            errorSource.first_name ? (
                                <FieldError
                                    message={errorSource.first_name}
                                />
                            ) : null}
                            <FormGroup>
                                <label>First Name*</label>
                                <Input value={this.state.first_name}
                                       onChange={this.onChangeField.bind(this, 'first_name')}
                                       required/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-main">
                            {errorSource &&
                            errorSource.last_name ? (
                                <FieldError
                                    message={errorSource.last_name}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Last Name*</label>
                                <Input value={this.state.last_name}
                                       onChange={this.onChangeField.bind(this, 'last_name')}
                                       required/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-main">
                            {errorSource &&
                            errorSource[companyField] ? (
                                <FieldError
                                    message={errorSource[companyField]}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Your company name</label>
                                <Input value={this.state.company}
                                       onChange={this.onChangeField.bind(this, 'company')} />
                            </FormGroup>
                        </Col>
                    </Row>

                    <div className="clearfix">
                        <IconButton type="submit" name="arrow-right" size='main'
                                    className="float-right onboard-action"
                                    disabled={this.props.isSaving.profile}/>
                    </div>
                </form>
            </div>
        );
    }
}
