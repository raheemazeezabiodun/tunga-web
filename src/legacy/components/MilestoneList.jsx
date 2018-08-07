import PropTypes from 'prop-types';
import React from 'react';
import {Link, IndexLink} from 'react-router';
import moment from 'moment';
import Linkify from './Linkify';

import Progress from './status/Progress';
import LoadMore from './status/LoadMore';
import SearchBox from './SearchBox';

import Avatar from './Avatar';

export default class MilestoneList extends React.Component {
    componentDidMount() {
        this.props.MilestoneActions.listMilestones({
            filter: this.getFilter(),
            skill: this.getSkill(),
            ...this.props.filters,
            search: this.props.search,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            (prevProps.location &&
                this.props.location &&
                prevProps.location.pathname != this.props.location.pathname) ||
            prevProps.search != this.props.search
        ) {
            this.props.MilestoneActions.listMilestones({
                filter: this.getFilter(),
                skill: this.getSkill(),
                ...this.props.filters,
                search: this.props.search,
            });
        }
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
            Milestone,
            MilestoneActions,
            hide_header,
            emptyListText,
        } = this.props;
        let filter = this.getFilter();
        let skill = this.getSkill();

        const ts_now = moment.utc().unix();

        return (
            <div>
                {hide_header ? null : (
                    <div>
                        <div className="clearfix">
                            <h2 className="pull-left">Scheduled Updates</h2>
                            <div className="pull-right">
                                <SearchBox
                                    placeholder="Search for milestones"
                                    filter={{
                                        filter,
                                        skill,
                                        ...this.props.filters,
                                    }}
                                    onSearch={MilestoneActions.listMilestones}
                                    count={Milestone.list.count}
                                />
                            </div>
                        </div>
                        <ul className="nav nav-pills nav-top-filter">
                            <li role="presentation">
                                <IndexLink
                                    to="/dashboard/updates"
                                    activeClassName="active">
                                    All Updates
                                </IndexLink>
                            </li>
                            <li role="presentation">
                                <Link
                                    to="/dashboard/updates/filter/upcoming"
                                    activeClassName="active">
                                    {' '}
                                    Upcoming Updates
                                </Link>
                            </li>
                            <li role="presentation">
                                <Link
                                    to="/dashboard/updates/filter/complete"
                                    activeClassName="active">
                                    {' '}
                                    Completed Updates
                                </Link>
                            </li>
                            <li role="presentation">
                                <Link
                                    to="/dashboard/updates/filter/missed"
                                    activeClassName="active">
                                    {' '}
                                    Missed Updates
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
                {Milestone.list.isFetching ? (
                    <Progress />
                ) : (
                    <div>
                        <div className="row flex-row">
                            {Milestone.list.ids.map(id => {
                                const milestone = Milestone.list.milestones[id];
                                const timestamp = moment
                                    .utc(milestone.due_at)
                                    .unix();
                                var milestone_status = '';
                                let time_24_hrs = 24 * 60 * 60;
                                let is_missed =
                                    timestamp + time_24_hrs < ts_now &&
                                    !milestone.report; // Developers have 24 hrs before a task update is missed

                                if (
                                    milestone.reports &&
                                    milestone.reports.length
                                ) {
                                    milestone_status = 'Completed';
                                } else if (timestamp + time_24_hrs > ts_now) {
                                    milestone_status = 'Upcoming';
                                } else if (timestamp + time_24_hrs < ts_now) {
                                    milestone_status = 'Missed';
                                }

                                return (
                                    <div
                                        className="col-sm-6 col-md-4"
                                        key={'milestone' + milestone.id}>
                                        <div className="card milestone-card">
                                            <Link
                                                to={`/work/${
                                                    milestone.details.task.id
                                                }/event/${milestone.id}`}>
                                                <h4>
                                                    {
                                                        milestone.details.task
                                                            .summary
                                                    }
                                                </h4>
                                            </Link>
                                            <Link
                                                to={`/work/${
                                                    milestone.details.task.id
                                                }/event/${milestone.id}`}>
                                                <h5>
                                                    {milestone.title
                                                        ? milestone.summary
                                                        : 'Scheduled update'}
                                                </h5>
                                            </Link>
                                            {milestone.due_at ? (
                                                <div>
                                                    Due Date:{' '}
                                                    <strong>
                                                        {moment
                                                            .utc(
                                                                milestone.due_at,
                                                            )
                                                            .local()
                                                            .format(
                                                                'Do, MMMM YYYY',
                                                            )}
                                                    </strong>
                                                </div>
                                            ) : null}
                                            <div>
                                                Status:{' '}
                                                <strong>
                                                    {milestone_status}
                                                </strong>
                                            </div>
                                            {milestone.description ? (
                                                <div>
                                                    <strong>Description</strong>
                                                    <div className="description">
                                                        <Linkify
                                                            properties={{
                                                                target:
                                                                    '_blank',
                                                            }}>
                                                            {
                                                                milestone.description
                                                            }
                                                        </Linkify>
                                                    </div>
                                                </div>
                                            ) : null}

                                            {milestone.details &&
                                            milestone.details
                                                .active_participants &&
                                            milestone.details
                                                .active_participants.length ? (
                                                <div>
                                                    <strong>Developers</strong>
                                                    {milestone.details.active_participants.map(
                                                        participation => {
                                                            const participant =
                                                                participation.user ||
                                                                participation;
                                                            return (
                                                                <div
                                                                    className="collaborator"
                                                                    key={
                                                                        participant.id
                                                                    }>
                                                                    <Avatar
                                                                        src={
                                                                            participant.avatar_url
                                                                        }
                                                                    />
                                                                    <Link
                                                                        to={`/people/${
                                                                            participant.username
                                                                        }/`}>
                                                                        {
                                                                            participant.display_name
                                                                        }
                                                                    </Link>
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {Milestone.list.ids.length ? (
                            <LoadMore
                                url={Milestone.list.next}
                                callback={MilestoneActions.listMoreMilestones}
                                loading={Milestone.list.isFetchingMore}
                            />
                        ) : (
                            <div className="alert alert-info">
                                {emptyListText}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

MilestoneList.propTypes = {
    emptyListText: PropTypes.string,
};

MilestoneList.defaultProps = {
    emptyListText: 'No updates match your query',
};
