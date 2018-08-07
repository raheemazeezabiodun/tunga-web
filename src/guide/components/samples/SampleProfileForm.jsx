import React from 'react';
import {FormGroup} from 'reactstrap';

import CustomInputGroup from '../../../components/core/CustomInputGroup';
import Button from '../../../components/core/Button';
import PropTypes from "prop-types";

export default class SampleProfileForm extends React.Component {
    static propTypes = {
        proceed: PropTypes.func,
        cancel: PropTypes.func,
        dismiss: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            name: null, address: null, tel: null
        }
    }

    onChangeField(key, e) {
        let newState = {};
        newState[key] = e.target.value;
        this.setState(newState);
    }

    onSave(e) {
        e.preventDefault();

        if(this.props.proceed) {
            this.props.proceed(this.state);
        }
    }

    onCancel(e) {
        e.preventDefault();

        if(this.props.cancel) {
            this.props.cancel(this.state);
        }
    }

    render() {
        return (
            <form onSubmit={this.onSave.bind(this)}>
                <FormGroup>
                    <CustomInputGroup variant="personal" onChange={this.onChangeField.bind('name')}/>
                </FormGroup>
                <FormGroup>
                    <CustomInputGroup variant="address" onChange={this.onChangeField.bind('address')}/>
                </FormGroup>
                <FormGroup>
                    <CustomInputGroup variant="tel" onChange={this.onChangeField.bind('tel')}/>
                </FormGroup>
                <FormGroup>
                    <Button type="button" variant="secondary" className="float-left" onClick={this.onCancel.bind(this)}>Cancel</Button>
                    <Button type="submit" className="float-right">Save</Button>
                </FormGroup>
            </form>
        );
    }
}
