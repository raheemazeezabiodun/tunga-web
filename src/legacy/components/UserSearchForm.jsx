import PropTypes from 'prop-types';
import React from 'react';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import UserSelector from '../containers/UserSelector';
import {CHANNEL_TYPES} from '../constants/Api';

import {isAdmin, getUser} from '../utils/auth';

class UserSearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {participants: [], type: null};
    }

    onParticipantChange(participants) {
        this.setState({participants: participants});
    }

    onTypeChange(type = null) {
        this.setState({type});
    }

    getOtherParticipants() {
        const {Channel} = this.props;
        let channel = this.props.channel || {};

        var participants = [];
        if (channel.id && channel.details) {
            channel.details.participants.forEach(user => {
                if (user.id != getUser().id) {
                    participants.push(user);
                }
            });
        }
        return participants;
    }

    getRecipient() {
        if (this.props.params && this.props.params.recipientId) {
            return this.props.params.recipientId;
        }
        return null;
    }

    getTaskId() {
        if (this.props.params && this.props.params.taskId) {
            return this.props.params.taskId;
        }
        return null;
    }

    UNSAFE_componentWillMount() {
        const channel = this.props.channel || {};
        if (channel.id && channel.details) {
            this.setState({participants: channel.details.participants});
        }

        let recipientId = this.getRecipient();
        let taskId = this.getTaskId();
        if (recipientId) {
            this.saveChannel([recipientId]);
        } else if (taskId) {
            this.saveChannel([], null, null, taskId);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (
            nextProps.Channel.detail.isSaved &&
            !this.props.Channel.detail.isSaved
        ) {
            const {Channel} = nextProps;
            this.refs.channel_form.reset();
            this.setState({participants: []});
            const {router} = this.context;
            router.replace('/conversation/' + Channel.detail.channel.id);
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        var subject = this.refs.subject ? this.refs.subject.value.trim() : null;
        const participants = this.state.participants;
        var message = this.refs.message ? this.refs.message.value.trim() : null;

        this.saveChannel(participants, subject, message);

        this.props.toggleButton();

        return;
    }

    saveChannel(
        participants = [],
        subject = null,
        message = null,
        task = null,
    ) {
        const {ChannelActions} = this.props;

        let channel = this.props.channel || {};
        let channel_info =
            this.state.type == CHANNEL_TYPES.developer
                ? {subject, message}
                : {subject, participants};
        if (channel.id) {
            ChannelActions.updateChannel(channel.id, channel_info);
        } else if (this.state.type == CHANNEL_TYPES.developer) {
            ChannelActions.createDeveloperChannel(channel_info);
        } else if (task) {
            ChannelActions.createTaskChannel(task);
        } else {
            ChannelActions.createChannel(channel_info);
        }
    }

    render() {
        const {Channel} = this.props;
        let channel = this.props.channel || {};
        return (
            <div className="new-channel">
                <form
                    onSubmit={this.handleSubmit.bind(this)}
                    className="form-inline"
                    name="channel"
                    role="form"
                    ref="channel_form">
                    {/*<FormStatus
           loading={Channel.detail.isSaving}
           success={Channel.detail.isSaved}
           message={'Channel created'}
           error={Channel.detail.error.create}
           />*/}

                    {/*isAdmin()
            ? <div className="form-group">
            <br />
            <div
              className="btn-group btn-choices btn-switch"
              role="group"
              aria-label="visibility">
              <button
                type="button"
                className={
                            'btn ' +
                            (this.state.type != CHANNEL_TYPES.developer
                                ? ' active'
                                : '')
                            }
                onClick={this.onTypeChange.bind(this, null)}>
                Selected users
              </button>
              <button
                type="button"
                className={
                            'btn ' +
                            (this.state.type == CHANNEL_TYPES.developer
                                ? ' active'
                                : '')
                            }
                onClick={this.onTypeChange.bind(
                            this,
                            CHANNEL_TYPES.developer,
                            )}>
                All Developers
              </button>
            </div>
          </div>
            : null*/}

                    {Channel.detail.error.create &&
                    Channel.detail.error.create.participants ? (
                        <FieldError
                            message={Channel.detail.error.create.participants}
                        />
                    ) : null}
                    {Channel.detail.error.update &&
                    Channel.detail.error.update.participants ? (
                        <FieldError
                            message={Channel.detail.error.update.participants}
                        />
                    ) : null}

                    {this.state.type != CHANNEL_TYPES.developer ? (
                        <div className="col-lg-11 form-group pull-left">
                            <UserSelector
                                filter={{filter: null}}
                                onChange={this.onParticipantChange.bind(this)}
                                selected={this.getOtherParticipants()}
                                unremovable={this.getOtherParticipants().map(
                                    user => {
                                        return user.id;
                                    },
                                )}
                            />
                        </div>
                    ) : null}

                    <div className="col-lg-1 form-group pull-right">
                        <button
                            type="submit"
                            className="btn"
                            disabled={Channel.detail.isSaving}>
                            {channel.id ? 'Update' : 'Go'}
                        </button>
                    </div>
                    <div className="clearfix" />

                    {Channel.detail.error.create &&
                    Channel.detail.error.create.subject ? (
                        <FieldError
                            message={Channel.detail.error.create.subject}
                        />
                    ) : null}
                    {Channel.detail.error.update &&
                    Channel.detail.error.update.subject ? (
                        <FieldError
                            message={Channel.detail.error.update.subject}
                        />
                    ) : null}

                    {Channel.detail.error.create &&
                    Channel.detail.error.create.message ? (
                        <FieldError
                            message={Channel.detail.error.create.message}
                        />
                    ) : null}
                    {Channel.detail.error.update &&
                    Channel.detail.error.update.message ? (
                        <FieldError
                            message={Channel.detail.error.update.message}
                        />
                    ) : null}
                    {this.state.type == CHANNEL_TYPES.developer ? (
                        <div className="form-group">
                            <label className="control-label">Message</label>
                            <div>
                                <textarea
                                    type="text"
                                    className="form-control"
                                    ref="message"
                                    placeholder="Type your message here"
                                    rows="3"
                                />
                            </div>
                            <div
                                className="alert alert-info"
                                style={{marginTop: '20px'}}>
                                This message will be sent to all developers via
                                email
                            </div>
                        </div>
                    ) : null}
                </form>
            </div>
        );
    }
}

export default UserSearchForm;

UserSearchForm.contextTypes = {
    router: PropTypes.object.isRequired,
};
