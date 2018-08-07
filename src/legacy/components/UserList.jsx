import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router';

import Progress from './status/Progress';
import LoadMore from './status/LoadMore';
import UserCard from './UserCard';
import SearchBox from './SearchBox';

import GenericListContainer from '../containers/GenericListContainer';

import {
    isAuthenticated,
    isAdmin,
    isDeveloper,
    isProjectOwner,
} from '../utils/auth';

export default class UserList extends GenericListContainer {
    componentDidUpdate(prevProps, prevState) {
        super.componentDidUpdate(prevProps, prevState);

        if (
            prevProps.location &&
            this.props.location &&
            prevProps.location.pathname != this.props.location.pathname
        ) {
            this.getList();
        }

        if (prevProps.search != this.props.search) {
            this.setState({
                selection_key:
                    this.state.selection_key + (this.props.search || ''),
                prev_key: this.state.selection_key,
            });
        }
    }

    getList(filters) {
        this.props.UserActions.listUsers(
            {
                filter: this.getFilter(),
                skill: this.getSkill(),
                ...this.props.filters,
                search: this.props.search,
            },
            this.state.selection_key,
            this.state.prev_key,
        );
    }

    getFilter() {
        if (this.props.params && this.props.params.filter) {
            return this.props.params.filter;
        }
        return null;
    }

    getSkill() {
        if (this.props.params && this.props.params.skill) {
            return this.props.params.skill;
        }
        return null;
    }

    render() {
        const {
            User,
            Notification,
            UserActions,
            bsClass,
            max,
            profileLink,
            tagLinks,
            filters,
        } = this.props;
        const requests =
            Notification && Notification.notifications
                ? Notification.notifications.requests
                : 0;

        let filter = this.getFilter();
        let skill = this.getSkill();

        var all_users = User.list.ids[this.state.selection_key] || [];
        if (max > 0) {
            all_users = all_users.slice(0, max);
        }

        return (
            <div>
                {this.props.hide_header ? null : (
                    <div>
                        <div className="clearfix">
                            <div className="pull-right">
                                <SearchBox
                                    placeholder="Search by name or skills"
                                    filter={{filter, skill}}
                                    onSearch={UserActions.listUsers}
                                    count={User.list.count}
                                />
                            </div>
                            <h2 className="pull-left">People</h2>
                        </div>
                        <div className="nav-top-filter">
                            <Link
                                to="/people/filter/developers"
                                activeClassName="active">
                                Developers
                            </Link>
                            {isAuthenticated()
                                ? [
                                      isAdmin() ? (
                                          <Link
                                              to="/people/filter/clients"
                                              key="clients"
                                              activeClassName="active">
                                              Clients
                                          </Link>
                                      ) : null,
                                      <Link
                                          to="/people/filter/team"
                                          activeClassName="active"
                                          key="team">
                                          {isDeveloper()
                                              ? 'My friends'
                                              : 'My team'}
                                      </Link>,
                                      isDeveloper() ? (
                                          <Link
                                              to="/people/filter/my-clients"
                                              key="my-clients"
                                              activeClassName="active">
                                              My Clients
                                          </Link>
                                      ) : null,
                                      <Link
                                          to="/people/filter/requests"
                                          activeClassName="active"
                                          key="requests"
                                          style={{marginLeft: '20px'}}>
                                          Requests{' '}
                                          {requests ? (
                                              <span className="badge">
                                                  {requests}
                                              </span>
                                          ) : null}
                                      </Link>,
                                      isProjectOwner() || isAdmin() ? (
                                          <Link
                                              to="/people/filter/relevant"
                                              key="relevant"
                                              activeClassName="active">
                                              Relevant to me
                                          </Link>
                                      ) : null,
                                  ]
                                : null}
                            {skill ? (
                                <Link
                                    to={`/people/skill/${skill}/`}
                                    className="active"
                                    style={{marginLeft: '20px'}}>
                                    <i className="tunga-icon-tag" /> {skill}
                                </Link>
                            ) : null}
                        </div>
                    </div>
                )}
                {User.list.isFetching ? (
                    <Progress />
                ) : (
                    <div>
                        <div className="row flex-row">
                            {all_users.map(id => {
                                const user = User.list.users[id];
                                if (
                                    filters &&
                                    filters.has_photo &&
                                    !user.avatar_url
                                ) {
                                    return;
                                }
                                return (
                                    <div
                                        className={
                                            bsClass || 'col-sm-6 col-md-4'
                                        }
                                        key={id}>
                                        <UserCard
                                            user={user}
                                            UserActions={UserActions}
                                            hideOnDisconnect={filter == 'team'}
                                            profileLink={profileLink}
                                            tagLinks={tagLinks}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        {(max && all_users.length < max) ||
                        (!max && User.list.next) ? (
                            <LoadMore
                                url={User.list.next}
                                callback={x => {
                                    UserActions.listMoreUsers(
                                        x,
                                        this.state.selection_key,
                                    );
                                }}
                                loading={User.list.isFetchingMore}
                            />
                        ) : null}
                        {all_users.length ? null : (
                            <div className="alert alert-info">
                                No users match your query
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

UserList.propTypes = {
    hide_header: PropTypes.bool,
    bsClass: PropTypes.string,
    max: PropTypes.number,
    profileLink: PropTypes.bool,
    tagLinks: PropTypes.bool,
};

UserList.defaultProps = {
    hide_header: false,
    bsClass: 'col-sm-6 col-md-4',
    max: 0,
    profileLink: true,
    tagLinks: true,
};
