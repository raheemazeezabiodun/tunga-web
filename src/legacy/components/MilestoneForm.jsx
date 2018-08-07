import React from 'react';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

import FieldError from './status/FieldError';
import {isAdminOrProjectManager} from '../utils/auth';

momentLocalizer(moment);

export default class MilestoneForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {due_at: null, description: '', internal: false};
    }

    componentDidMount() {
        const milestone = this.props.milestone;
        if (milestone) {
            this.setState({due_at: milestone.due_at});
        }
    }

    onDueAtChange(date) {
        this.setState({
            due_at: moment(date)
                .utc()
                .format(),
        });
    }

    onInputChange(key, e) {
        var new_state = {};
        new_state[key] = e.target.value;
        this.setState(new_state);
    }

    onInputCheck() {
        this.setState({
            internal: !this.state.internal,
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        var title = this.refs.title.value.trim();
        var description = this.state.description;
        var due_at = this.state.due_at;
        var internal = this.state.internal;

        if (this.props.onSave) {
            this.props.onSave({
                ...this.props.milestone,
                title,
                description,
                due_at,
                internal,
            });
        }
        if (this.props.close) {
            this.props.close();
        }
    };

    render() {
        const milestone = this.props.milestone || {};

        return (
            <div>
                <form
                    onSubmit={this.handleSubmit}
                    name="milestone"
                    role="form"
                    ref="milestone_form">
                    {this.state.error && this.state.error.title ? (
                        <FieldError message={this.state.error.title} />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">Title *</label>
                        <div>
                            <input
                                type="text"
                                className="form-control"
                                ref="title"
                                required
                                placeholder="Title"
                                defaultValue={milestone.title}
                            />
                        </div>
                    </div>

                    {this.state.error && this.state.error.due_at ? (
                        <FieldError message={this.state.error.due_at} />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">Due at *</label>
                        <DateTimePicker
                            ref="due_at"
                            onChange={this.onDueAtChange.bind(this)}
                            defaultValue={
                                milestone.due_at
                                    ? new Date(
                                          moment.utc(milestone.due_at).format(),
                                      )
                                    : null
                            }
                            time={false}
                        />
                    </div>

                    <div className="form-group">
                        <label className="control-label">Description</label>
                        <textarea
                            className="form-control"
                            onChange={this.onInputChange.bind(
                                this,
                                'description',
                            )}
                            defaultValue={milestone.description}
                            ref="description"
                            placeholder="Description"
                        />
                    </div>

                    {isAdminOrProjectManager() ? (
                        <div className="form-group">
                            <label className="control-label">
                                <input
                                    defaultChecked={this.state.internal}
                                    onChange={() => this.onInputCheck()}
                                    type="checkbox"
                                />{' '}
                                Internal Milestone
                            </label>
                        </div>
                    ) : null}

                    <div className="text-center">
                        <button type="submit" className="btn  ">
                            {milestone.idx > -1 ? 'Update' : 'Add'} milestone
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
