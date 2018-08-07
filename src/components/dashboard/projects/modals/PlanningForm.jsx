import PropTypes from "prop-types";
import React from 'react';
import {FormGroup} from 'reactstrap';

import Button from '../../../../components/core/Button';
import Input from "../../../core/Input";
import TextArea from "../../../core/TextArea";
import CustomInputGroup from "../../../core/CustomInputGroup";

export default class PlanningForm extends React.Component {
    static propTypes = {
        plan: PropTypes.shape({
            id: PropTypes.number,
            title: PropTypes.string,
            url: PropTypes.string,
            reason: PropTypes.string,
        }),
        proceed: PropTypes.func,
        cancel: PropTypes.func,
        dismiss: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            plan: props.plan || {},
        }
    }

    onChangeValue(key, value) {
        let newState = {};
        newState[key] = value;
        this.setState({plan: {...this.state.plan, ...newState}});
    }

    onChangeField(key, e) {
        this.onChangeValue(key, e.target.value)
    }

    onSave = (e) => {
        e.preventDefault();

        if(this.props.proceed) {
            this.props.proceed(this.state.plan);
        }
    };

    onCancel = (e) => {
        e.preventDefault();

        if(this.props.cancel) {
            this.props.cancel(this.state.plan);
        }
    };

    render() {
        return (
            <form onSubmit={this.onSave.bind(this)}>
                <FormGroup>
                    <CustomInputGroup variant="url"
                                    value={this.state.plan.url}
                                    onChange={this.onChangeField.bind(this, 'url')}
                                    required/>
                </FormGroup>
                <FormGroup>
                    <Input placeholder="Name of file"
                           value={this.state.plan.title}
                           onChange={this.onChangeField.bind(this, 'title')}
                           required/>
                </FormGroup>
                {this.state.plan.id?(
                    <FormGroup>
                        <label>Reason for changing document</label>
                        <TextArea value={this.state.plan.reason}
                                  onChange={this.onChangeField.bind(this, 'reason')}
                                  required/>
                    </FormGroup>
                ):null}
                <FormGroup>
                    <Button type="button" variant="secondary" className="float-left" onClick={this.onCancel.bind(this)}>Cancel</Button>
                    <Button type="submit" className="float-right">Save</Button>
                </FormGroup>
            </form>
        );
    }
}
