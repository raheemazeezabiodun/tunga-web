import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup} from 'reactstrap';

import CustomInputGroup from '../core/CustomInputGroup';
import CountrySelector from '../core/CountrySelector';
import FieldError from '../core/FieldError';
import Success from '../core/Success';
import Button from "../core/Button";


export default class CompanyDetails extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        errors: PropTypes.object,
        ProfileActions: PropTypes.object,
    };

    constructor(props) {
        super(props);
        const { company } = props.user;
        this.state = {
            company: {
                street: company.street || '',
                plot_number: company.plot_number || '',
                city: company.city || '',
                postal_code: company.postal_code || '',
                country: company.country || '',
                vat_number: company.vat_number || '',
                reg_no: company.reg_no || ''
            }
        }
    }

    onChangeField(key, e) {
        let newState = {};
        newState[key] = e.target.value;
        this.setState({company: {...this.state.company, ...newState}});
    }

    onSave(e) {
        e.preventDefault();
        const {user, ProfileActions} = this.props;
        ProfileActions.updateCompany(user.company.id, this.state.company);
        return;
    }

    render() {
        const { errors } = this.props;
        return (
            <div>
                {this.props.isSaved.company ? (
                    <Success message="Company details saved successfully" />
                    ): null
                }
                <form onSubmit={this.onSave.bind(this)}>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.company &&
                            errors.company.street ? (
                                <FieldError
                                    message={errors.company.street}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Street</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'street')}
                                    value={this.state.company.street}
                                />
                            </FormGroup>
                        </div>
                        <div className="col-sm-4">
                        {errors.company &&
                            errors.company.plot_number ? (
                                <FieldError
                                    message={errors.company.plot_number}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Number/Plot</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'plot_number')}
                                    value={this.state.company.plot_number}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.company &&
                            errors.company.city ? (
                                <FieldError
                                    message={errors.company.city}
                                />
                            ) : null}
                            <FormGroup>
                                <label>City</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'city')}
                                    variant=' '
                                    placeholder=' '
                                    defaultValue={this.state.city}
                                />
                            </FormGroup>
                        </div>
                        <div className="col-sm-4">
                        {errors.company &&
                            errors.company.postal_code ? (
                                <FieldError
                                    message={errors.company.postal_code}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Zip Code</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'postal_code')}
                                    value={this.state.company.postal_code}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.company &&
                            errors.company.country ? (
                                <FieldError
                                    message={errors.company.country}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Country</label>
                                <CountrySelector
                                    onChange={this.onChangeField.bind(this, 'country')}
                                    selected={this.state.country}
                                />
                            </FormGroup>
                        </div>
                        <div className="col-sm-4">
                        {errors.company &&
                            errors.company.vat_number ? (
                                <FieldError
                                    message={errors.company.vat_number}
                                />
                            ) : null}
                            <FormGroup>
                                <label>VAT number</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'vat_number')}
                                    variant=' '
                                    placeholder=' '
                                    value={this.state.company.vat_number}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.company &&
                            errors.company.reg_no ? (
                                <FieldError
                                    message={errors.company.reg_no}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Company Registration Number (Optional)</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'reg_no')}
                                    value={this.state.company.reg_no}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <Button
                        type="save"
                        className="float-right"
                        disabled={this.props.isSaving.company}>
                        Save
                    </Button>
                </form>
            </div>
        );
    }
}
