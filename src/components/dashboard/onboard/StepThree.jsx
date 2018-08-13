import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup, Row, Col} from 'reactstrap';

import Input from '../../core/InputGroup';
import FieldError from '../../core/FieldError';
import Icon from '../../core/Icon';
import Upload from '../../core/Upload';
import IconButton from "../../core/IconButton";
import Avatar from "../../core/Avatar";

import {isDevOrPM} from "../../utils/auth";


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

        let dataSource = user.is_project_owner?user.company:user.profile;

        this.state = {
            phone_number: dataSource[user.is_project_owner?'tel_number':'phone_number'] || '',
            vat_number: dataSource.vat_number || '',
            reg_no: dataSource[user.is_project_owner?'reg_no':'company_reg_no'] || '',
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isSaved.profile || nextProps.isSaved.company) {
            this.props.history.push(`/onboard/${isDevOrPM()?'identity':'finish'}`);
        }
    }

    onChangeValue(key, value) {
        let newState = {};
        newState[key] = value;
        this.setState(newState);
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

        if(user.is_project_owner) {
            // Clients get a company object

            let companyData = {
                tel_number: this.state.phone_number,
                vat_number: this.state.vat_number,
                reg_no: this.state.reg_no
            };

            if(this.state.image) {
                companyData.user = {image: this.state.image};
            }

            ProfileActions.updateCompany(user.company.id, companyData);

        } else {
            // Other users get a profile
            let profileData = {
                phone_number: this.state.phone_number,
                vat_number: this.state.vat_number,
                company_reg_no: this.state.reg_no
            };
            if(this.state.image) {
                profileData.user = {image: this.state.image};
            }
            ProfileActions.updateProfile(user.profile.id, profileData);
        }
        return;
    }

    render() {
        const {user, errors} = this.props;

        let errorSource = (user.is_project_owner?errors.company:errors.profile) || {},
            telField = user.is_project_owner?'tel_number':'phone_number',
            regNoField = user.is_project_owner?'reg_no':'company_reg_no';

        return (
            <div>
                <form onSubmit={this.onSave.bind(this)} className="clearfix">
                    <Row>
                        <Col className="col-main">
                            {errorSource &&
                            errorSource[telField] ? (
                                <FieldError
                                    message={errorSource[telField]}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Phone Number</label>
                                <Input value={this.state.phone_number} onChange={this.onChangeField.bind(this, 'phone_number')}/>
                            </FormGroup>

                            {errorSource &&
                            errorSource.vat_number ? (
                                <FieldError
                                    message={errorSource.vat_number}
                                />
                            ) : null}
                            <FormGroup>
                                <label>VAT No</label>
                                <Input value={this.state.vat_number} onChange={this.onChangeField.bind(this, 'vat_number')}/>
                            </FormGroup>

                            {errorSource &&
                            errorSource[regNoField] ? (
                                <FieldError
                                    message={errorSource[regNoField]}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Company registration number</label>
                                <Input value={this.state.reg_no} onChange={this.onChangeField.bind(this, 'reg_no')}/>
                            </FormGroup>
                        </Col>
                        <Col className="col-avatar">
                            {errorSource &&
                            errorSource.image ? (
                                <FieldError
                                    message={errorSource.image}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Profile Picture</label>
                                <Upload
                                    type='image'
                                    placeholder={user.avatar_url?<Avatar image={user.avatar_url} size="lg"/>:<Icon name='avatar' size='xl' />}
                                    onChange={this.onChangeFile.bind(this)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className="clearfix">
                        <IconButton name='arrow-left' size='main'
                                    className="float-left onboard-action"
                                    onClick={() => this.props.history.push('/onboard/step-two')} />
                        <IconButton type="submit"
                                    name={isDevOrPM()?'arrow-right':'check2'}
                                    size='main'
                                    className="btn float-right onboard-action"/>
                    </div>
                </form>
            </div>
        );
    }
}
