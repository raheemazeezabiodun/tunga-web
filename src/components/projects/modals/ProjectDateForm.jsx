import PropTypes from "prop-types";
import React from 'react';
import {FormGroup} from 'reactstrap';

import Button from '../../../components/core/Button';
import Input from "../../core/Input";
import DateTimePicker from "../../core/DateTimePicker";
import TextArea from "../../core/TextArea";
import moment from "moment/moment";
import CustomInputGroup from "../../core/CustomInputGroup";

export default class ProjectDateForm extends React.Component {
    static propTypes = {
        project: PropTypes.shape({
            id: PropTypes.number,
            date: PropTypes.string,
            reason: PropTypes.string,
        }),
        proceed: PropTypes.func,
        cancel: PropTypes.func,
        dismiss: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            project: props.project || {},
        }
    }

    onChangeValue(key, value) {
        let newState = {};
        newState[key] = value;
        this.setState({project: {...this.state.project, ...newState}});
    }

    onChangeField(key, e) {
        this.onChangeValue(key, e.target.value)
    }

    onSave = (e) => {
        e.preventDefault();

        if(this.props.proceed) {
            this.props.proceed(this.state.project);
        }
    };

    onCancel = (e) => {
        e.preventDefault();

        if(this.props.cancel) {
            this.props.cancel(this.state.project);
        }
    };

    render() {
        return (
            <form onSubmit={this.onSave.bind(this)}>
                <FormGroup>
                    <DateTimePicker calendar={true} time={false}
                                    value={this.state.project.date?new Date(this.state.project.date):null}
                                    onChange={(date) => { this.onChangeValue('date', moment(date).format())}}
                                    required/>
                </FormGroup>
                {this.props.project.date?(
                    <FormGroup>
                        <label>Reason for changing date</label>
                        <TextArea value={this.state.project.reason}
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
