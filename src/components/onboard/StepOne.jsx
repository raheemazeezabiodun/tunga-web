import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup} from 'reactstrap';

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
            company: user.company.name || ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isSaved.profile) {
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

        ProfileActions.updateProfile(user.profile.id, {
            first_name: this.state.first_name,
            last_name: this.state.last_name
        });

        ProfileActions.updateCompany(user.company.id, {
            name: this.state.company
        });
        return;
    }

    render() {
        const {errors} = this.props;
        return (
            <div>
                <form onSubmit={this.onSave.bind(this)}>
                    <div className="col-sm-8">
                    {errors.profile &&
                        errors.profile.first_name ? (
                            <FieldError
                                message={errors.profile.first_name}
                            />
                        ) : null}
                        <FormGroup>
                            <label>First Name*</label>
                            <Input value={this.state.first_name} onChange={this.onChangeField.bind(this, 'first_name')} />
                        </FormGroup>
                    </div>
                    <div className="col-sm-8">
                    {errors.profile &&
                        errors.profile.last_name ? (
                            <FieldError
                                message={errors.profile.last_name}
                            />
                        ) : null}
                        <FormGroup>
                            <label>Last Name*</label>
                            <Input value={this.state.last_name} onChange={this.onChangeField.bind(this, 'last_name')} />
                        </FormGroup>
                    </div>
                    <div className="col-sm-8">
                    {errors.company &&
                        errors.company.name ? (
                            <FieldError
                                message={errors.company.name}
                            />
                        ) : null}
                        <FormGroup>
                            <label>Your company name</label>
                            <Input value={this.state.company} onChange={this.onChangeField.bind(this, 'company')} />
                        </FormGroup>
                    </div>
                    <IconButton type="submit" name="arrow-right" size='md'
                                className="float-right onboard-action"
                                disabled={this.props.isSaving.profile}/>
                </form>
            </div>
        );
    }
}
