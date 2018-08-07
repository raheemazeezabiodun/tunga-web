import React from 'react';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import FieldError from './status/FieldError';

momentLocalizer(moment);

export default class PlanForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {start_date: null, end_date: null, description: ''};
    }

    componentDidMount() {
        const activity = this.props.activity;
        if (activity) {
            this.setState({
                start_date: activity.start_date,
                end_date: activity.end_date,
            });
        }
    }

    onEndDateChange(date) {
        this.setState({
            end_date: moment(date)
                .utc()
                .format(),
        });
    }

    onInputChange(key, e) {
        var new_state = {};
        new_state[key] = e.target.value;
        this.setState(new_state);
    }

    onStartDateChange(date) {
        this.setState({
            start_date: moment(date)
                .utc()
                .format(),
        });
    }

    onStateValueChange(key, value) {
        var new_state = {};
        new_state[key] = value;
        this.setState(new_state);
    }

    handleSubmit = e => {
        e.preventDefault();
        var title = this.refs.title.value.trim();
        var start_date = this.state.start_date;
        var end_date = this.state.end_date;
        var description = this.refs.description.value.trim();

        if (this.props.onSave) {
            this.props.onSave({
                ...this.props.activity,
                title,
                start_date,
                end_date,
                description,
            });
        }
        if (this.props.close) {
            this.props.close();
        }
    };

    render() {
        const activity = this.props.activity || {};

        return (
            <div>
                <form
                    onSubmit={this.handleSubmit}
                    name="activity"
                    role="form"
                    ref="activity_form">
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
                                defaultValue={activity.title}
                            />
                        </div>
                    </div>

                    {this.state.error && this.state.error.start_date ? (
                        <FieldError message={this.state.error.start_date} />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">Start Date *</label>
                        <DateTimePicker
                            ref="due_at"
                            onChange={this.onStartDateChange.bind(this)}
                            defaultValue={
                                activity.start_date
                                    ? new Date(
                                          moment
                                              .utc(activity.start_date)
                                              .format(),
                                      )
                                    : null
                            }
                            time={false}
                        />
                    </div>

                    {this.state.error && this.state.error.end_date ? (
                        <FieldError message={this.state.error.end_date} />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">End Date *</label>
                        <DateTimePicker
                            ref="due_at"
                            onChange={this.onEndDateChange.bind(this)}
                            defaultValue={
                                activity.start_date
                                    ? new Date(
                                          moment
                                              .utc(activity.start_date)
                                              .format(),
                                      )
                                    : null
                            }
                            time={false}
                        />
                    </div>

                    {this.state.error && this.state.error.description ? (
                        <FieldError message={this.state.error.description} />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">Description</label>
                        <textarea
                            className="form-control"
                            onChange={this.onInputChange.bind(
                                this,
                                'description',
                            )}
                            defaultValue={activity.description}
                            ref="description"
                            placeholder="Introduction"
                        />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn  ">
                            {activity.idx > -1 ? 'Update' : 'Add'} Milestone
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
