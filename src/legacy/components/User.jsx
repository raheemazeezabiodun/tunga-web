import React from 'react';
import {Link} from 'react-router';
import Rating from 'react-rating';
import Linkify from './Linkify';

import TagList from './TagList';
import UserCardProfile from './UserCardProfile';
import {RATING_CRITERIA_CHOICES, ENDPOINT_USER} from '../constants/Api';
import {isProjectOwner} from '../utils/auth';

import {STATUS_ACCEPTED, STATUS_REJECTED} from '../constants/Api';

export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {ratings_map: null};
    }

    componentDidMount() {
        this.props.UserActions.retrieveUser(this.props.params.userId);
    }

    UNSAFE_componentWillMount() {
        this.mapUserRatings(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (
            nextProps.User.detail.user.ratings !=
            this.props.User.detail.user.ratings
        ) {
            this.mapUserRatings(nextProps);
        }
    }

    handleConnectRequest() {
        const {User, UserActions} = this.props;
        const {user} = User.detail;
        UserActions.createConnection({to_user: user.id});
    }

    handleConnectResponse(accepted = false) {
        const {User, UserActions} = this.props;
        const {user} = User.detail;
        UserActions.updateConnection(user.request, {
            accepted,
            status: accepted ? STATUS_ACCEPTED : STATUS_REJECTED,
        });
    }

    handleDeleteConnection() {
        const {User, UserActions} = this.props;
        const {user} = User.detail;
        if (user.connection) {
            UserActions.deleteConnection(user.connection.id, user, false);
        }
    }

    mapUserRatings(props) {
        const {User} = props;
        const {user} = User.detail;
        if (
            user &&
            user.ratings &&
            user.ratings.details &&
            user.ratings.details.length
        ) {
            var ratings_map = {};
            user.ratings.details.forEach(rating => {
                ratings_map[rating.criteria] = rating;
            });
            this.setState({ratings_map});
        }
    }

    render() {
        const {User} = this.props;
        const {user} = User.detail;

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
            <div className="profile-page">
                {User.list.isRetrieving ? (
                    <Progress />
                ) : (
                    <div>
                        <UserCardProfile
                            user={user}
                            avatarSize="xl"
                            profileLink={false}
                        />
                        <div className="actions">
                            {/*<Link to={`/conversation/start/${user.id}`} className="btn">
                  Send message
                </Link>*/}
                            {user.can_connect ? (
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={this.handleConnectRequest.bind(
                                        this,
                                    )}>
                                    {connection_msg}
                                </button>
                            ) : user.request ? (
                                [
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={this.handleConnectResponse.bind(
                                            this,
                                            true,
                                        )}>
                                        Accept Request
                                    </button>,
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={this.handleConnectResponse.bind(
                                            this,
                                            false,
                                        )}>
                                        Decline Request
                                    </button>,
                                ]
                            ) : null}
                            {user.connection &&
                            user.connection.status == STATUS_ACCEPTED ? (
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={this.handleDeleteConnection.bind(
                                        this,
                                    )}>
                                    {remove_msg}
                                </button>
                            ) : null}
                            <a
                                href={`${ENDPOINT_USER}${
                                    user.id
                                }/download/profile?format=pdf`}
                                className="btn btn-primary"
                                target="_blank">
                                <i className="fa fa-file-pdf-o" /> Download Pdf
                            </a>
                        </div>
                        <div>
                            {user.profile ? (
                                <div>
                                    {user.profile.company ||
                                    user.profile.country_name ||
                                    user.profile.city ? (
                                        <div className="media">
                                            <div className="media-left">
                                                <i className="tunga-icon-location fa-2x" />
                                            </div>
                                            <div className="media-body">
                                                <div className="card">
                                                    <div>
                                                        {user.profile.company}
                                                    </div>
                                                    <div>
                                                        {
                                                            user.profile
                                                                .plot_number
                                                        }{' '}
                                                        {user.profile.street}
                                                    </div>
                                                    <div>
                                                        {user.profile.city}
                                                    </div>
                                                    <div>
                                                        {
                                                            user.profile
                                                                .country_name
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                    <p />
                                    {user.profile.bio ? (
                                        <div className="media">
                                            <div className="media-left">
                                                <i className="tunga-icon-profile fa-2x" />
                                            </div>
                                            <div className="media-body">
                                                <div className="card">
                                                    <Linkify
                                                        properties={{
                                                            target: '_blank',
                                                        }}>
                                                        {user.profile.bio}
                                                    </Linkify>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                    {user.profile.website ? (
                                        <div className="media">
                                            <div className="media-left">
                                                <i className="tunga-icon-web-alt fa-2x" />
                                            </div>
                                            <div className="media-body">
                                                <div className="card">
                                                    <a
                                                        target="_blank"
                                                        href={
                                                            user.profile.website
                                                        }>
                                                        {user.profile.website}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                    {user.profile.skills &&
                                    user.profile.skills.length ? (
                                        <div className="media">
                                            <div className="media-left">
                                                <i className="tunga-icon-tag fa-2x" />
                                            </div>
                                            <div className="media-body">
                                                <TagList
                                                    tags={user.profile.skills}
                                                    linkPrefix="/people/skill/"
                                                />
                                            </div>
                                        </div>
                                    ) : null}
                                    {user.ratings &&
                                    user.ratings.details &&
                                    user.ratings.details.length ? (
                                        <div className="media">
                                            <div className="media-left">
                                                <i className="fa fa-star-o fa-2x" />
                                            </div>
                                            <div className="media-body">
                                                <div className="card">
                                                    {RATING_CRITERIA_CHOICES.map(
                                                        criteria => {
                                                            let rating = this
                                                                .state
                                                                .ratings_map[
                                                                criteria.id
                                                            ];
                                                            return (
                                                                <div
                                                                    key={
                                                                        criteria.id
                                                                    }
                                                                    style={{
                                                                        margin:
                                                                            '5px 0',
                                                                    }}>
                                                                    <div>
                                                                        {
                                                                            criteria.name
                                                                        }
                                                                    </div>
                                                                    {this.state
                                                                        .ratings_map &&
                                                                    this.state
                                                                        .ratings_map[
                                                                        criteria
                                                                            .id
                                                                    ] ? (
                                                                        <div>
                                                                            <div className="rating">
                                                                                <Rating
                                                                                    start={
                                                                                        0
                                                                                    }
                                                                                    stop={
                                                                                        10
                                                                                    }
                                                                                    step={
                                                                                        2
                                                                                    }
                                                                                    fractions={
                                                                                        2
                                                                                    }
                                                                                    initialRate={
                                                                                        rating.avg
                                                                                    }
                                                                                    empty={
                                                                                        'fa fa-star-o'
                                                                                    }
                                                                                    full={
                                                                                        'fa fa-star'
                                                                                    }
                                                                                    readonly={
                                                                                        true
                                                                                    }
                                                                                />
                                                                            </div>{' '}
                                                                            ({
                                                                                rating.display_avg
                                                                            }{' '}
                                                                            rating)
                                                                        </div>
                                                                    ) : (
                                                                        <div className="secondary">
                                                                            No
                                                                            ratings
                                                                            yet!
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                    {user.work.length ? (
                                        <div className="media">
                                            <div className="media-left">
                                                <i className="tunga-icon-cv fa-2x" />
                                            </div>
                                            <div className="media-body">
                                                {user.work.map(item => {
                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className="card">
                                                            <div>
                                                                {item.position}
                                                            </div>
                                                            <div>
                                                                {item.company}
                                                            </div>
                                                            <div>
                                                                {
                                                                    item.start_month_display
                                                                }/{
                                                                    item.start_year
                                                                }{' '}
                                                                -{' '}
                                                                {item.end_year
                                                                    ? `${
                                                                          item.end_month_display
                                                                      }/${
                                                                          item.end_year
                                                                      }`
                                                                    : 'Present'}
                                                            </div>
                                                            <div
                                                                style={{
                                                                    margin:
                                                                        '5px 0',
                                                                }}>
                                                                <Linkify
                                                                    properties={{
                                                                        target:
                                                                            '_blank',
                                                                    }}>
                                                                    {
                                                                        item.details
                                                                    }
                                                                </Linkify>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : null}
                                    {user.education.length ? (
                                        <div className="media">
                                            <div className="media-left">
                                                <i className="tunga-icon-education fa-2x" />
                                            </div>
                                            <div className="media-body">
                                                {user.education.map(item => {
                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className="card">
                                                            <div>
                                                                {
                                                                    item.institution
                                                                }
                                                            </div>
                                                            <div>
                                                                {item.award}
                                                            </div>
                                                            <div>
                                                                {
                                                                    item.start_month_display
                                                                }/{
                                                                    item.start_year
                                                                }{' '}
                                                                -{' '}
                                                                {item.end_year
                                                                    ? `${
                                                                          item.end_month_display
                                                                      }/${
                                                                          item.end_year
                                                                      }`
                                                                    : 'Present'}
                                                            </div>
                                                            <div
                                                                style={{
                                                                    margin:
                                                                        '5px 0',
                                                                }}>
                                                                <Linkify
                                                                    properties={{
                                                                        target:
                                                                            '_blank',
                                                                    }}>
                                                                    {
                                                                        item.details
                                                                    }
                                                                </Linkify>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
