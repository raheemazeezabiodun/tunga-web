import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router';
import Progress from './status/Progress';
import FormStatus from './status/FormStatus';

import {parseNumber} from '../utils/helpers';

export default class Participation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {users: {}};
    }

    componentDidMount() {
        const {task} = this.props;
        if (task.details && task.details.participation_shares.length) {
            this.parseUsers(task.details.participation_shares);
        }
    }

    onShareChange(user, e) {
        var new_user = {};
        new_user[user] = e.target.value;
        this.setState({users: {...this.state.users, ...new_user}});
    }

    getParticipation() {
        var participation = [];
        Object.keys(this.state.users).forEach(key => {
            participation.push({
                user: key,
                share: parseFloat(this.state.users[key]).toFixed(2) || 0,
            });
        });
        return participation;
    }

    getTotalShares() {
        var total = 0;
        Object.keys(this.state.users).forEach(key => {
            total += parseFloat(this.state.users[key]) || 0;
        });
        return Math.round(total);
    }

    handleSubmit(e) {
        e.preventDefault();

        const {task, TaskActions} = this.props;
        TaskActions.updateTask(task.id, {
            participation: this.getParticipation(),
        });
    }

    parseUsers(participation_shares) {
        var users = {};
        participation_shares.forEach(item => {
            users[item.participant.user.id] = item.percentage;
        });
        this.setState({users});
    }

    render() {
        const {task, Task} = this.props;
        let total_shares = this.getTotalShares();

        return (
            <div>
                {Task.detail.isRetrieving ? (
                    <Progress />
                ) : (
                    <div style={{marginTop: '20px'}}>
                        <form
                            onSubmit={this.handleSubmit.bind(this)}
                            name="participation"
                            role="form"
                            ref="participation_form">
                            <FormStatus
                                loading={Task.detail.isSaving}
                                success={Task.detail.isSaved}
                                message={
                                    'Participation details saved successfully'
                                }
                                error={Task.detail.error.update}
                            />

                            {task.details &&
                            task.details.participation_shares.length ? (
                                <div>
                                    {task.details.participation_shares.map(
                                        item => {
                                            return (
                                                <div
                                                    key={item.participant.id}
                                                    className="row form-group">
                                                    <div className="col-md-6">
                                                        <label className="control-label">
                                                            <Link
                                                                to={`/people/${
                                                                    item
                                                                        .participant
                                                                        .user
                                                                        .username
                                                                }`}>
                                                                {
                                                                    item
                                                                        .participant
                                                                        .user
                                                                        .display_name
                                                                }
                                                            </Link>
                                                        </label>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            required
                                                            placeholder="Share"
                                                            defaultValue={parseNumber(
                                                                item.percentage,
                                                                false,
                                                            )}
                                                            onChange={this.onShareChange.bind(
                                                                this,
                                                                item.participant
                                                                    .user.id,
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            ) : null}

                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="btn"
                                    disabled={Task.detail.isSaving}>
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        );
    }
}

Participation.propTypes = {
    task: PropTypes.object.isRequired,
};

Participation.defaultProps = {
    task: {},
};
