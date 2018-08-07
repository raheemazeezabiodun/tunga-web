import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';

import FieldError from './status/FieldError';
import UserSelector from '../containers/UserSelector';

momentLocalizer(moment);

import {USER_TYPE_DEVELOPER, USER_TYPE_PROJECT_MANAGER} from '../constants/Api';

export default class ActivityForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            assignee: null,
            completed: false,
            ...(this.props.activity || {}),
        };
    }

    componentDidMount() {
        const activity = this.props.activity;
    }

    onAssigneeChange(users) {
        var assignee = null;
        if (Array.isArray(users) && users.length) {
            assignee = users[0];
        }
        this.setState({assignee});
    }

    onInputChange(key, e) {
        var new_state = {};
        new_state[key] = e.target.value;
        this.setState(new_state);
    }

    onStateValueChange(key, value) {
        var new_state = {};
        new_state[key] = value;
        this.setState(new_state);
    }

    onStatusChange(e) {
        this.setState({completed: !this.state.completed});
    }

    handleSubmit = e => {
        e.preventDefault();
        var title = this.refs.title.value.trim();
        var hours = this.refs.hours.value.trim();
        var description = this.refs.description.value.trim();
        var assignee = this.state.assignee;
        var completed = this.state.completed;

        let activity_info = {...this.props.activity, title, hours, description};

        const {selectUser, setStatus, onSave, close} = this.props;

        if (selectUser) {
            activity_info.assignee = assignee;
            activity_info.assignee_id = assignee ? assignee.id : null;
        }

        if (setStatus) {
            activity_info.completed = completed;
        }

        if (onSave) {
            onSave(activity_info);
        }
        if (close) {
            close();
        }
    };

    render() {
        const {selectUser, setStatus} = this.props;
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

                    {this.state.error && this.state.error.hours ? (
                        <FieldError message={this.state.error.hours} />
                    ) : null}
                    <div className="form-group">
                        <label className="control-label">
                            Estimated hours *
                        </label>
                        <div>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                ref="hours"
                                required
                                placeholder="Hours"
                                defaultValue={activity.hours}
                            />
                        </div>
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

                    {selectUser ? (
                        <div>
                            {this.state.error && this.state.error.assignee ? (
                                <FieldError
                                    message={this.state.error.assignee}
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Assignee *
                                </label>
                                <UserSelector
                                    filter={{
                                        types: [
                                            USER_TYPE_DEVELOPER,
                                            USER_TYPE_PROJECT_MANAGER,
                                        ].join(','),
                                    }}
                                    onChange={this.onAssigneeChange.bind(this)}
                                    selected={
                                        activity.assignee
                                            ? [activity.assignee]
                                            : []
                                    }
                                    max={1}
                                    returnObjects={true}
                                />
                            </div>
                        </div>
                    ) : null}

                    {setStatus ? (
                        <div className="form-group">
                            <div className="checkbox">
                                <label className="control-label">
                                    <input
                                        type="checkbox"
                                        ref="agree_deadline"
                                        checked={this.state.status}
                                        onChange={this.onStatusChange.bind(
                                            this,
                                        )}
                                    />
                                    Has this activity been completed?
                                </label>
                            </div>
                        </div>
                    ) : null}

                    <div className="text-center">
                        <button type="submit" className="btn  ">
                            {activity.idx > -1 ? 'Update' : 'Add'} activity
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

ActivityForm.propTypes = {
    activity: PropTypes.object,
    onSave: PropTypes.func,
    close: PropTypes.func,
    selectUser: PropTypes.bool,
    setStatus: PropTypes.bool,
};

ActivityForm.defaultProps = {
    activity: null,
    onSave: null,
    close: null,
    selectUser: false,
    setStatus: false,
};
