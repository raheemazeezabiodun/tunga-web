import PropTypes from "prop-types";
import React from 'react';
import {FormGroup} from 'reactstrap';
import moment from "moment";

import Button from '../../../../components/core/Button';
import Input from "../../../core/Input";
import DateTimePicker from "../../../core/DateTimePicker";
import TextArea from "../../../core/TextArea";

export default class MilestoneForm extends React.Component {
    static propTypes = {
        milestone: PropTypes.shape({
            id: PropTypes.number,
            title: PropTypes.string,
            due_at: PropTypes.string,
            reason: PropTypes.string,
        }),
        proceed: PropTypes.func,
        cancel: PropTypes.func,
        dismiss: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            milestone: props.milestone || {},
        }
    }

    onChangeValue(key, value) {
        let newState = {};
        newState[key] = value;
        this.setState({milestone: {...this.state.milestone, ...newState}});
    }

    onChangeField(key, e) {
        this.onChangeValue(key, e.target.value)
    }

    onSave = (e) => {
        e.preventDefault();

        if(this.props.proceed) {
            this.props.proceed(this.state.milestone);
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
                    <Input placeholder="Title of milestone (e.g, End of sprint 1)"
                           value={this.state.milestone.title}
                           onChange={this.onChangeField.bind(this, 'title')}
                           required/>
                </FormGroup>
                <FormGroup>
                    <DateTimePicker calendar={true} time={false} placeholder="Due date"
                                    value={this.state.milestone.due_at?new Date(this.state.milestone.due_at):null}
                                    onChange={(date) => { this.onChangeValue('due_at', moment.utc(date).format())}}
                                    required/>
                </FormGroup>
                {this.state.milestone.id?(
                    <FormGroup>
                        <label>Reason for changing date</label>
                        <TextArea value={this.state.milestone.reason}
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
