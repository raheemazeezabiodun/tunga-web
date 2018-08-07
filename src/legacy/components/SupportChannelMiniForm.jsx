import PropTypes from 'prop-types';
import React from 'react';

import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';

import {isAuthenticated, isAdmin} from '../utils/auth';

export default class SupportChannelMiniForm extends React.Component {
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (
            nextProps.Channel.detail.isSaved &&
            !this.props.Channel.detail.isSaved
        ) {
            const {Channel} = nextProps;
            this.refs.channel_form.reset();
            this.setState({participants: []});
            const {router} = this.context;
            if (isAuthenticated()) {
                router.replace('/channel/' + Channel.detail.channel.id);
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        var email = this.refs.email ? this.refs.email.value.trim() : null;

        this.saveChannel(email);
        return;
    }

    saveChannel(email) {
        const {channel, ChannelActions} = this.props;
        ChannelActions.createSupportChannel({
            id: channel ? channel.id : null,
            email,
        });
    }

    render() {
        const {Channel} = this.props;
        if (isAdmin()) {
            return null;
        }

        return (
            <div className="new-channel">
                <form
                    onSubmit={this.handleSubmit.bind(this)}
                    name="channel"
                    role="form"
                    ref="channel_form">
                    {/*<FormStatus
            loading={Channel.detail.isSaving}
            success={Channel.detail.isSaved}
            message={'Changes saved'}
            error={Channel.detail.error.create}
          />*/}

                    <div>
                        {Channel.detail.error.create &&
                        Channel.detail.error.create.email ? (
                            <FieldError
                                message={Channel.detail.error.create.email}
                            />
                        ) : null}
                        <div className="form-group">
                            <div className="input-group">
                                <input
                                    type="text"
                                    ref="email"
                                    className="form-control"
                                    placeholder="Your email address"
                                    required
                                />
                                <span className="input-group-btn">
                                    <button
                                        className="btn btn-grey"
                                        type="submit">
                                        <i className="fa fa-paper-plane" />
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

SupportChannelMiniForm.contextTypes = {
    router: PropTypes.object.isRequired,
};
