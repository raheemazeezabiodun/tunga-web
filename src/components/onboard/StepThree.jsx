import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup} from 'reactstrap';

import Input from '../core/InputGroup';
import FieldError from '../core/FieldError';
import Icon from '../core/Icon';
import Upload from '../core/Upload';
import IconButton from "../core/IconButton";


export default class StepThree extends React.Component {
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
            phone_number: user.profile.phone_number || '',
            vat_no: user.profile.vat_no || '',
            reg_no: user.profile.reg_no || '',
            //image: user.image || ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isSaved.profile) {
            this.props.history.push('/onboard/finish');
        }
    }

    onChangeValue(key, value) {
        let newState = {};
        newState[key] = value;
        this.setState({profile: {...this.state.profile, ...newState}});
    }

    onChangeField(key, e) {
        this.onChangeValue(key, e.target.value);
    }

    onChangeFile(files) {
        this.onChangeValue('image', files[0]);
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
                            <div>
                                <div className="col-sm-12">
                                    {errors.profile &&
                                        errors.profile.phone_number ? (
                                            <FieldError
                                                message={errors.profile.phone_number}
                                            />
                                        ) : null}
                                    <FormGroup>
                                        <label>Phone Number</label>
                                        <Input value={this.state.profile.phone_number} onChange={this.onChangeField.bind(this, 'phone_number')}/>
                                    </FormGroup>
                                </div>
                                <div className="col-sm-12">
                                {errors.profile &&
                                    errors.profile.vat_no ? (
                                        <FieldError
                                            message={errors.profile.vat_no}
                                        />
                                    ) : null}
                                    <FormGroup>
                                        <label>VAT No</label>
                                        <Input value={this.state.profile.vat_no} onChange={this.onChangeField.bind(this, 'vat_no')}/>
                                    </FormGroup>
                                </div>
                                <div className="col-sm-12">
                                {errors.profile &&
                                    errors.profile.reg_no ? (
                                        <FieldError
                                            message={errors.profile.reg_no}
                                        />
                                    ) : null}
                                    <FormGroup>
                                        <label>Company registration number</label>
                                        <Input value={this.state.profile.reg_no} onChange={this.onChangeField.bind(this, 'reg_no')}/>
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                        {errors.profile &&
                            errors.profile.image ? (
                                <FieldError
                                    message={errors.profile.image}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Picture</label>
                                <Upload
                                    type='image'
                                    placeholder={<Icon name='avatar' size='xl' />}
                                    onChange={this.onChangeFile.bind(this)}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <IconButton name='arrow-left' size='md'
                                className="float-left onboard-action"
                                onClick={() => this.props.history.push('/onboard/step-two')} />
                    <IconButton type="submit" name='check2' size='md'
                                className="btn float-right onboard-action"/>
                </form>
            </div>
        );
    }
}
