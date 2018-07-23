import React from 'react';
import {Link} from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import randomstring from 'randomstring';
import humanizeDuration from 'humanize-duration';
import moment from 'moment';

import Icon from "../core/Icon";
import Progress from "../core/Progress";
import IconButton from "../core/IconButton";

import connect from '../../connectors/ProfileConnector';

import {getUser, isDev} from "../utils/auth";
import {STATUS_APPROVED, STATUS_PENDING} from "../../actions/utils/api";


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {targetKey: randomstring.generate()};
    }

    componentDidMount() {
        const {ProfileActions} = this.props;
        ProfileActions.getNotifications();
    }

    getDays(date) {
        let period = humanizeDuration((moment().unix() - moment.utc('2016-06-09T18:29:52.879000' || date).add('day', 1).startOf('day').unix())*1000, { largest: 1, round: true, units: ['d']}).split(' ');
        return {number: period[0], name: period[1]};
    }

    renderNotification(text, linkText, linkUrl) {
        return (
            <div className="notification">
                <div className="float-right">
                    {linkUrl?(<Link to={linkUrl}>{linkText}</Link>):null} <IconButton name="close" size="sm"/>
                </div>
                {text}
            </div>
        );
    }

    render() {

        const {Profile: {notifications: {profile, projects, invoices, reports, events, activities}, isRetrieving}} = this.props;

        return (
            <div className="dashboard">
                {isRetrieving.notifications?(
                    <Progress/>
                ):(
                    <React.Fragment>
                        <Row>
                            <Col sm={8}>
                                <div className="card">
                                    <div className="section-title"><Icon name="bell"/> Notifications</div>

                                    {profile.required.length || profile.optional.length?(
                                        this.renderNotification(
                                            <div>Please complete your profile {profile.required.length?<span>to be able to {isDev()?'accept':'create'} projects</span>:''}</div>,
                                            'Go to profile', '/settings/'
                                        )
                                    ):null}

                                    {isDev() && ![STATUS_APPROVED, STATUS_PENDING].includes(getUser().payoneer_status)?(
                                        this.renderNotification('Please connect your account with Payoneer to receive payments', 'Set up Payoneer', '/settings/payment/')
                                    ):null}

                                    {activities.length?(
                                        activities.slice(0, 4 - (((profile.required.length || profile.optional.length)?1:0)+(isDev() && ![STATUS_APPROVED, STATUS_PENDING].includes(getUser().payoneer_status)?1:0))).map(item => {
                                            return this.renderNotification(
                                                <div>
                                                    {getUser().id === item.activity.user.id?'You have':(<span><Link to={`/network/${item.activity.user.username}`}>{item.activity.user.display_name}</Link> has</span>)} been added to {isDev()?'the':'your'} team for {item.activity.project.title}
                                                </div>,
                                                'Go to project', `/projects/${item.activity.project.id}`);
                                        })
                                    ):null}
                                </div>

                                <Row>
                                    <Col sm={6}>
                                        <div className="card">
                                            {isDev()?(
                                                <div>
                                                    <div className="section-title">
                                                        <Icon name="flag-checkered"/> Upcoming updates
                                                    </div>
                                                    {(events || []).map(event => {
                                                        return (
                                                            <div className="item">
                                                                Scheduled update for <Link to={`/projects/${event.project.id}/events/${event.id}`}>{event.project.title}{event.title?`: ${event.title}`:''}</Link>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ):(
                                                <div>
                                                    <div className="section-title">
                                                        <Icon name="newspaper-o"/> Latest progress reports
                                                    </div>
                                                    {(reports || []).map(report => {
                                                        return (
                                                            <div className="item clearfix">
                                                                <div className="date float-right">{moment.utc(report.created_at).format('DD/MMM')}</div>
                                                                Progress report from <Link to={`/network/${report.user.username}`}>{report.user.display_name}</Link> for <Link to={`/projects/${report.project.id}/events/${report.event.id}`}>{report.project.title}</Link>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="card">
                                            <div className="section-title"><Icon name="cash"/> Upcoming payments</div>
                                            {invoices.length?(
                                                <div>
                                                    <div>
                                                        Next payment for <Link to={`/projects/${invoices[0].project.id}/pay/`}>{invoices[0].project.title}: {invoices[0].title}</Link> is due in:
                                                    </div>
                                                    <div className="countdown">
                                                        <span className="number">{this.getDays(invoices[0].due_at).number}</span>
                                                        <span className="period">{this.getDays(invoices[0].due_at).name}</span>
                                                    </div>
                                                </div>
                                            ):null}
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={4}>
                                <div className="card">
                                    <div className="section-title"><Icon name="projects"/> {isDev()?'Project I am working on':'Running projects'}</div>
                                    {(projects || []).map(project => {
                                        return (
                                            <div className="project-item">
                                                <Link to={`/projects/${project.id}`}>{project.title}</Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Col>
                        </Row>
                    </React.Fragment>
                )}
                <Link to="/projects/new" className="btn btn-icon cta">
                    <span>Create new project</span> <Icon name="add" size="xl"/>
                </Link>
            </div>
        );
    }
}

export default connect(Dashboard);
