import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup} from 'reactstrap';

import Input from '../core/InputGroup';
import FieldError from '../core/FieldError';
import CountrySelector from '../core/CountrySelector';
import IconButton from "../core/IconButton";


export default class StepTwo extends React.Component {
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
            profile: {
                street: user.profile.street || '',
                city: user.profile.city || '',
                country: user.profile.country || '',
                plot_number: user.profile.plot_number || '',
                postal_code: user.profile.postal_code || ''
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isSaved.profile) {
            this.props.history.push('/onboard/step-three');
        }
    }

    onChangeField(key, e) {
        let newState = {};
        newState[key] = e.target.value;
        this.setState({profile: {...this.state.profile, ...newState}});
    }

    onSave(e) {
        e.preventDefault();
        const {user, ProfileActions} = this.props;

        ProfileActions.updateProfile(user.profile.id, this.state.profile);
        return;
    }


    render() {
        const {errors} = this.props;
        return (
            <div>
                <form onSubmit={this.onSave.bind(this)}>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.profile &&
                            errors.profile.street ? (
                                <FieldError
                                    message={errors.profile.street}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Street *</label>
                                <Input value={this.state.profile.street}
                                       onChange={this.onChangeField.bind(this, 'street')}
                                       required/>
                            </FormGroup>
                        </div>
                        <div className="col-sm-3">
                        {errors.profile &&
                            errors.profile.plot_number ? (
                                <FieldError
                                    message={errors.profile.plot_number}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Number/Plot *</label>
                                <Input value={this.state.profile.plot_number}
                                       onChange={this.onChangeField.bind(this, 'plot_number')}
                                       required/>
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.profile &&
                            errors.profile.city ? (
                                <FieldError
                                    message={errors.profile.city}
                                />
                            ) : null}
                            <FormGroup>
                                <label>City *</label>
                                <Input value={this.state.profile.city}
                                       onChange={this.onChangeField.bind(this, 'city')}
                                       required/>
                            </FormGroup>
                        </div>
                        <div className="col-sm-3">
                        {errors.profile &&
                            errors.profile.postal_code ? (
                                <FieldError
                                    message={errors.profile.postal_code}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Zip code *</label>
                                <Input value={this.state.profile.postal_code}
                                       onChange={this.onChangeField.bind(this, 'postal_code')}
                                       required/>
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                            {errors.profile &&
                            errors.profile.country ? (
                                <FieldError
                                    message={errors.profile.country}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Country *</label>
                                <CountrySelector value={this.state.profile.country}
                                                 onChange={this.onChangeField.bind(this, 'country')}
                                                 required/>
                            </FormGroup>
                        </div>
                    </div>
                <div>
                    <IconButton name="arrow-left" size="md"
                                className="float-left onboard-action"
                                onClick={() => this.props.history.push('/onboard/step-one')} />
                    <IconButton type="submit" name="arrow-right" size="md" className="float-right onboard-action"/>
                </div>
                </form>
            </div>
        );
    }
}
