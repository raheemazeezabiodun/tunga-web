import React from 'react';
import moment from 'moment';
import {Link} from 'react-router';
import TimeAgo from 'react-timeago';
import {OverlayTrigger, Popover} from 'react-bootstrap';
import {resizeOverviewBox} from './TaskWorkflow';
import Milestone from './Milestone';

import {
    LEGACY_PROGRESS_EVENT_TYPE_MILESTONE,
    LEGACY_PROGRESS_EVENT_TYPE_SUBMIT,
    LEGACY_PROGRESS_EVENT_TYPE_COMPLETE,
} from '../constants/Api';

export default class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            min: null,
            max: null,
            duration: 0,
            all_events: [],
            next_event: null,
            now: moment.utc().unix(),
        };
    }

    componentDidMount() {
        this.parseTimeline();
        $(document).ready(resizeOverviewBox);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.events.length != prevProps.events.length) {
            this.parseTimeline();
            $(document).ready(resizeOverviewBox);
        }
    }

    describeArc(x, y, radius, startAngle, endAngle) {
        var start = this.polarToCartesian(x, y, radius, endAngle);
        var end = this.polarToCartesian(x, y, radius, startAngle);

        var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

        var d = [
            'M',
            start.x,
            start.y,
            'A',
            radius,
            radius,
            0,
            largeArcFlag,
            0,
            end.x,
            end.y,
        ].join(' ');

        return d;
    }

    openMilestone(event) {
        if (this.props.openMilestone) {
            this.props.openMilestone(event.id);
        }
    }

    parseTimeline() {
        const {start, end, events} = this.props;
        var all_events = [];
        if (start) {
            all_events.push({title: 'Task created', due_at: start});
        }
        if (end) {
            all_events.push({
                title: 'Deadline',
                due_at: end,
                is_deadline: true,
            });
        }

        all_events.push({
            title: 'Reminder',
            due_at: moment.unix(this.state.now).format(),
            is_now: true,
        });

        //all_events = [...all_events, ...events];
        var next_event = null;
        const now = this.state.now;
        var timestamps = all_events.map(event => {
            let this_tm = moment.utc(event.due_at).unix();
            if (
                (this_tm > now || event.is_deadline) &&
                (!next_event ||
                    (next_event &&
                        this_tm < moment.utc(next_event.due_at).unix()))
            ) {
                next_event = event;
            }
            return this_tm;
        });
        var min = null,
            max = null,
            duration = 0;
        if (timestamps.length) {
            min = Math.min(...timestamps);
            max = Math.max(...timestamps);
            duration = max - min;
        }
        this.setState({min, max, duration, all_events, next_event});
    }

    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians),
        };
    }

    renderEvent(event) {
        if (!this.state.duration) {
            return null;
        }
        const timestamp = moment.utc(event.due_at).unix(),
            next_timestamp =
                this.state.next_event && this.state.next_event.due_at
                    ? moment.utc(this.state.next_event.due_at).unix()
                    : null;
        const length = timestamp - this.state.min;
        const ts_now = this.state.now;
        let is_missed = timestamp + 24 * 60 * 60 < ts_now && event.type; // Developers have 24 hrs before a task update is missed
        var pos = length / this.state.duration * 100;

        const {task} = this.props;

        const popover = this.state.next_event ? (
            <Popover id="popover">
                <div className="title">{event.title || 'Scheduled Update'}</div>
                {event.is_now ? (
                    <div>
                        {this.state.next_event.type
                            ? 'Next ' +
                              ([
                                  LEGACY_PROGRESS_EVENT_TYPE_MILESTONE,
                                  LEGACY_PROGRESS_EVENT_TYPE_SUBMIT,
                                  LEGACY_PROGRESS_EVENT_TYPE_COMPLETE,
                              ].indexOf(event.type) > -1
                                  ? 'Milestone'
                                  : 'Update')
                            : 'Deadline'}
                        <span>
                            {' '}
                            {next_timestamp && timestamp > next_timestamp
                                ? 'was'
                                : 'is'}{' '}
                        </span>
                        <TimeAgo
                            date={moment
                                .utc(this.state.next_event.due_at)
                                .local()
                                .format()}
                        />
                    </div>
                ) : (
                    <div>
                        {event.due_at
                            ? moment
                                  .utc(event.due_at)
                                  .local()
                                  .format('ddd Do, MMMM YYYY')
                            : null}
                        {event.report ? (
                            <div>
                                <strong>Status: </strong>
                                <span>{event.report.status_display}</span>
                                <br />
                                <strong>Completed: </strong>
                                <span>{event.report.percentage}%</span>
                            </div>
                        ) : is_missed ? (
                            <div>
                                <strong>
                                    {[
                                        LEGACY_PROGRESS_EVENT_TYPE_MILESTONE,
                                        LEGACY_PROGRESS_EVENT_TYPE_SUBMIT,
                                        LEGACY_PROGRESS_EVENT_TYPE_COMPLETE,
                                    ].indexOf(event.type) > -1
                                        ? 'Milestone'
                                        : 'Update'}{' '}
                                    missed
                                </strong>
                            </div>
                        ) : null}
                    </div>
                )}
            </Popover>
        ) : null;
        return (
            <OverlayTrigger
                key={event.due_at}
                placement="top"
                overlay={popover}>
                {event.id ? (
                    <Link
                        to={`/work/${task.id}/event/${event.id}`}
                        className="event"
                        style={{left: `${pos}%`}}
                    />
                ) : (
                    <div
                        className={`event ${
                            timestamp > this.state.now ? 'future' : ''
                        } ${event.is_now ? 'now' : ''}`}
                        style={{left: `${pos}%`}}
                    />
                )}
            </OverlayTrigger>
        );
    }

    render() {
        console.log('All events: ', this.state.all_events.length);
        if (this.state.all_events.length < 3) {
            // should have at least: start, end and now
            return null;
        }

        const length = this.state.now - this.state.min;
        var fill_length = length / this.state.duration * 100;
        return (
            <div className={`timeline ${this.props.className}`}>
                <div className="line" />
                <div className="duration" style={{width: `${fill_length}%`}} />
                {this.state.all_events.map(event => {
                    return this.renderEvent(event);
                })}
            </div>
        );
    }
}
