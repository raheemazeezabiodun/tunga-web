import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router';
import Rating from 'react-rating';
import Avatar from './Avatar';

import {isAuthenticated, isAdmin} from '../utils/auth';

export default class UserCardProfile extends React.Component {
    render() {
        const {user, avatarSize, profileLink} = this.props;

        return (
            <div className="media">
                <div className="media-left">
                    <Avatar
                        src={user.avatar_url}
                        size={avatarSize || 'large'}
                    />
                </div>
                <div className="media-body">
                    {profileLink ? (
                        <Link to={`/people/${user.username}/`}>
                            {user.display_name}
                        </Link>
                    ) : (
                        <div>{user.display_name}</div>
                    )}

                    {isAdmin() ? (
                        <div>
                            <p>
                                <a href={`mailto:${user.email}`}>
                                    {user.email}
                                </a>
                            </p>
                            {user.profile && user.profile.phone_number ? (
                                <p>
                                    <a
                                        href={`tel:${
                                            user.profile.phone_number
                                        }`}>
                                        {user.profile.phone_number}
                                    </a>
                                </p>
                            ) : null}
                        </div>
                    ) : null}
                    {user.is_project_owner && user.profile ? (
                        <p>{user.profile.company}</p>
                    ) : null}
                    {user.profile &&
                    (user.profile.city || user.profile.country_name) ? (
                        <div>
                            {user.profile.city}, {user.profile.country_name}
                        </div>
                    ) : null}
                    {!user.is_developer &&
                    user.tasks_created &&
                    isAuthenticated() ? (
                        <div>
                            {user.tasks_created} task{user.tasks_created == 1
                                ? ''
                                : 's'}{' '}
                            created
                        </div>
                    ) : null}
                    {user.is_developer &&
                    user.tasks_completed &&
                    isAuthenticated() ? (
                        <div>
                            {user.tasks_completed} task{user.tasks_completed ==
                            1
                                ? ''
                                : 's'}{' '}
                            completed
                        </div>
                    ) : null}
                    {user.is_developer ? (
                        user.ratings && user.ratings.avg ? (
                            <div>
                                <div className="rating">
                                    <Rating
                                        start={0}
                                        stop={10}
                                        step={2}
                                        fractions={2}
                                        initialRate={user.ratings.avg}
                                        empty={'fa fa-star-o'}
                                        full={'fa fa-star'}
                                        readonly={true}
                                    />
                                </div>
                            </div>
                        ) : null
                    ) : null}
                </div>
            </div>
        );
    }
}

UserCardProfile.propTypes = {
    user: PropTypes.object.isRequired,
    avatarSize: PropTypes.string,
    profileLink: PropTypes.bool,
};

UserCardProfile.defaultProps = {
    profileLink: true,
};
