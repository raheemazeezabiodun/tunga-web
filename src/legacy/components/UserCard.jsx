import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router';
import Linkify from './Linkify';

import UserCardProfile from './UserCardProfile';
import TagList from './TagList';

import {isProjectOwner} from '../utils/auth';

import {STATUS_ACCEPTED, STATUS_REJECTED} from '../constants/Api';

export default class UserCard extends React.Component {
    handleConnectRequest() {
        const {UserActions, user} = this.props;
        UserActions.createConnection({to_user: user.id});
    }

    handleConnectResponse(accepted = false) {
        const {UserActions, user} = this.props;
        UserActions.updateConnection(user.request, {
            accepted,
            status: accepted ? STATUS_ACCEPTED : STATUS_REJECTED,
        });
    }

    handleDeleteConnection() {
        const {UserActions, user, hideOnDisconnect} = this.props;
        if (user.connection) {
            UserActions.deleteConnection(
                user.connection.id,
                user,
                hideOnDisconnect,
            );
        }
    }

    render() {
        const {user, profileLink, tagLinks} = this.props;
        var connection_msg = 'Send friend request';
        var remove_msg = 'Remove friend';
        if (isProjectOwner()) {
            connection_msg = 'Add to my team';
            remove_msg = 'Remove from my team';
        } else if (user.is_project_owner) {
            connection_msg = 'Send request to join team';
            remove_msg = 'Leave team';
        }

        return (
            <div className="card user-card">
                <UserCardProfile user={user} profileLink={profileLink} />
                <div
                    className={`skills ${
                        user.is_developer ? '' : 'skills-needed'
                    }`}>
                    {user.profile ? (
                        <div>
                            {!user.is_developer ? (
                                <div className="secondary">Skills I need:</div>
                            ) : null}
                            {user.profile.skills.length ? (
                                <TagList
                                    tags={user.profile.skills}
                                    max={3}
                                    linkPrefix="/people/skill/"
                                    moreLink={`/people/${user.username}/`}
                                    showLinks={tagLinks}
                                />
                            ) : null}
                        </div>
                    ) : null}
                </div>

                <div className="short-description">
                    {user.profile ? (
                        <Linkify properties={{target: '_blank'}}>
                            {user.profile.bio}
                        </Linkify>
                    ) : null}
                </div>
                <div className="actions">
                    <div className="row">
                        <div className="col-sm-12">
                            <Link
                                to={`/people/${user.username}/`}
                                className="btn btn-block ">
                                Go to profile
                            </Link>
                        </div>
                    </div>

                    {user.can_connect ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <button
                                    type="button"
                                    className="btn btn-block "
                                    onClick={this.handleConnectRequest.bind(
                                        this,
                                    )}>
                                    {connection_msg}
                                </button>
                            </div>
                        </div>
                    ) : user.request ? (
                        <div className="row">
                            <div className="col-sm-6">
                                <button
                                    type="button"
                                    className="btn btn-block "
                                    onClick={this.handleConnectResponse.bind(
                                        this,
                                        true,
                                    )}>
                                    Accept Request
                                </button>
                            </div>
                            <div className="col-sm-6">
                                <button
                                    type="button"
                                    className="btn btn-block "
                                    onClick={this.handleConnectResponse.bind(
                                        this,
                                        false,
                                    )}>
                                    Decline Request
                                </button>
                            </div>
                        </div>
                    ) : null}
                    {user.connection &&
                    user.connection.status == STATUS_ACCEPTED ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <button
                                    type="button"
                                    className="btn btn-block "
                                    onClick={this.handleDeleteConnection.bind(
                                        this,
                                    )}>
                                    {remove_msg}
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}

UserCard.propTypes = {
    user: PropTypes.object.isRequired,
    profileLink: PropTypes.bool,
    tagLinks: PropTypes.bool,
};

UserCard.defaultProps = {
    user: {},
    profileLink: true,
    tagLinks: true,
};
