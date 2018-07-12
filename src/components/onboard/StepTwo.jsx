import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup, Row, Col} from 'reactstrap';

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

        let dataSource = user.is_project_owner?user.company:user.profile;

        this.state = {
            profile: {
                street: dataSource.street || '',
                city: dataSource.city || '',
                country: dataSource.country || '',
                plot_number: dataSource.plot_number || '',
                postal_code: dataSource.postal_code || ''
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isSaved.profile || nextProps.isSaved.company) {
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

        if(user.is_project_owner) {
            // Clients get a company object
            ProfileActions.updateCompany(user.company.id, this.state.profile);
        } else {
            // Other users get a profile
            ProfileActions.updateProfile(user.profile.id, this.state.profile);
        }
        return;
    }


    render() {
        const {errors} = this.props;

        let errorSource = user.is_project_owner?errors.company:errors.profile;

        return (
            <div>
                <form onSubmit={this.onSave.bind(this)} className="clearfix">
                    <Row>
                        <Col className="col-main">
                            {errorSource &&
                            errorSource.street ? (
                                <FieldError
                                    message={errorSource.street}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Street *</label>
                                <Input value={this.state.profile.street}
                                       onChange={this.onChangeField.bind(this, 'street')}
                                       required/>
                            </FormGroup>
                        </Col>
                        <Col className="col-side">
                            {errorSource &&
                            errorSource.plot_number ? (
                                <FieldError
                                    message={errorSource.plot_number}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Number/Plot *</label>
                                <Input value={this.state.profile.plot_number}
                                       onChange={this.onChangeField.bind(this, 'plot_number')}
                                       required/>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="col-main">
                            {errorSource &&
                            errorSource.city ? (
                                <FieldError
                                    message={errorSource.city}
                                />
                            ) : null}
                            <FormGroup>
                                <label>City *</label>
                                <Input value={this.state.profile.city}
                                       onChange={this.onChangeField.bind(this, 'city')}
                                       required/>
                            </FormGroup>
                        </Col>
                        <Col className="col-side">
                            {errorSource &&
                            errorSource.postal_code ? (
                                <FieldError
                                    message={errorSource.postal_code}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Zip code *</label>
                                <Input value={this.state.profile.postal_code}
                                       onChange={this.onChangeField.bind(this, 'postal_code')}
                                       required/>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="col-main">
                            {errorSource &&
                            errorSource.country ? (
                                <FieldError
                                    message={errorSource.country}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Country *</label>
                                <CountrySelector value={this.state.profile.country}
                                                 onChange={this.onChangeField.bind(this, 'country')}
                                                 required/>
                            </FormGroup>
                        </Col>
                    </Row>
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
