import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup, Row, Col} from 'reactstrap';

import Input from '../core/InputGroup';
import FieldError from '../core/FieldError';
import Icon from '../core/Icon';
import Upload from '../core/Upload';
import IconButton from "../core/IconButton";
import Avatar from "../core/Avatar";
import {isDevOrPM} from "../utils/auth";


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

        this.state = {
            image: null
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isSaved.profile) {
            this.nextSection();
        }
    }

    nextSection() {
        this.props.history.push('/onboard/payment');
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

        if(this.state.image) {
            ProfileActions.updateProfile(user.profile.id, {image: this.state.image});
        } else {
            this.nextSection();
        }
        return;
    }

    render() {
        const {user, errors} = this.props;

        return (
            <div>
                <form onSubmit={this.onSave.bind(this)} className="clearfix">
                    {errors.profile &&
                    errors.profile.id_document ? (
                        <FieldError
                            message={errors.profile.id_document}
                        />
                    ) : null}
                    <FormGroup>
                        <label className="control-label">Upload ID (passport or national ID card)</label>
                        <Upload
                            type='image'
                            className='upload-id-doc'
                            placeholder={user.profile.id_document?<img src={user.profile.id_document} height="130px" title="ID document"/>:<Icon name='id' size='xl' />}
                            onChange={this.onChangeFile.bind(this, 'id_document')}
                        />
                    </FormGroup>
                    <div className="clearfix">
                        <IconButton name='arrow-left' size='main'
                                    className="float-left onboard-action"
                                    onClick={() => this.props.history.push('/onboard/step-three')} />
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
