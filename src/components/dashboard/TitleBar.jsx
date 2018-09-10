import React from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import moment from 'moment';

import TitleBarContent from './TitleBarContent';
import ProjectOutput from './ProjectOutput';
import {isAdmin, isAdminOrPM, isAdminOrPMOrClient, isClient, isDev} from "../utils/auth";
import PropTypes from "prop-types";
import Icon from "../core/Icon";

export default class TitleBar extends React.Component {

    static defaultProps = {
        isLargeDevice: true,
        showBreadCrumbs: false
    };

    static propTypes = {
        isLargeDevice: PropTypes.bool,
        showBreadCrumbs: PropTypes.bool,
    };

    render() {
        const {user, isLargeDevice, showBreadCrumbs} = this.props;

        let projectsSections = [
                ['/projects', 'Active Projects'],
                ['/projects/filter/archived', 'Archived Projects'],
                ['/projects/filter/opportunity', 'Opportunities']
            ],
            projectCreateSections = [
                ['/projects/new', 'Create new project'],
            ],
            networkSections = [
            ['/network', 'Developers'],
            ['/network/filter/relevant', 'Relevant for me']
        ], paymentSections = [
            ...(isDev()?[]:[
                ['/payments/filter/pending-in', 'Pending payments'],
                ['/payments/filter/paid-in', 'Paid payments'],
            ]),
            ...(isClient() && !isAdmin()?[]:[
                ['/payments/filter/pending-out', 'Pending payouts'],
                ['/payments/filter/paid-out', 'Paid payouts'],
            ]),
        ], settingsSections = [
            ['/settings/profile', 'Profile'], // All
            ...(isClient()?[
                // Clients only
                ['/settings/company-profile', 'Company profile'],
                ['/settings/company-details', 'Company details']
            ]:[]),
            ...(isClient()?[]:[
                // Devs and PMs only
                ['/settings/experience', 'Experience'],
                ['/settings/payment', 'Payment settings'],
            ]),
            ['/settings/account', 'Account'], // All
            ['/settings/privacy', 'Privacy settings'], // All
        ];

        let projectLists = [
            'Projects',
            isAdminOrPMOrClient()?'/projects/new':null,
            projectsSections
        ];

        return (
            <div className={`titlebar ${showBreadCrumbs?'has-breadcrumbs':''}`}>
                {showBreadCrumbs?(
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active">
                                <Link to="/dashboard"><Icon name="meter" size="icon"/></Link>
                            </li>
                            <Switch>
                                <Route path={`/projects/:projectId/activity`} component={() => {
                                    return (
                                        <li className="breadcrumb-item active">Meeting room</li>
                                    );
                                }}/>
                                <Route path={`/projects/:projectId/events/:eventId`} component={({match}) => {
                                    return (
                                        <React.Fragment>
                                            <li className="breadcrumb-item active">
                                                <Link to={`/projects/${match.params.projectId}/activity`}>Meeting room</Link>
                                            </li>
                                            <li className="breadcrumb-item active">Survey</li>
                                        </React.Fragment>
                                    );
                                }}/>
                            </Switch>
                        </ol>
                    </nav>
                ):(
                    <Switch>
                        {[
                            ['/onboard', 'Welcome to Tunga!'],
                            ...['/dashboard', '/work', '/proposal'].map(path => {
                                return [path, <div>Hi {user.display_name}</div>, isLargeDevice?`/projects/new${isAdminOrPM()?`/stage`:''}`:null, null, {subTitle: moment().format('dddd, Do of MMMM')}]
                            }),
                            ...(isLargeDevice?
                                [
                                    ['/projects/new', 'Projects', null, [...projectsSections, ...projectCreateSections]],
                                    ['/projects/filter/:filter', ...projectLists],
                                    ['/projects/:projectId', 'Projects', isAdminOrPMOrClient()?'/projects/new':null, [[(match) => { return match.url }, (match) => { return match.params.projectId?<ProjectOutput id={match.params.projectId} field="title"/>:'Project title' }, {exact: false}]]],
                                    ['/projects', ...projectLists],
                                    ['/network/invite', 'Network', null, [...networkSections, ['/network/invite', 'Invite User']]],
                                    ['/network', 'Network', isAdminOrPM()?'/network/invite':null, networkSections],
                                    ['/payments', 'Payments', null, paymentSections],
                                    ['/settings', 'Settings', null, settingsSections],
                                ]:[])

                        ].map(path => {
                            return (
                                <Route key={`title-path--${path}`}
                                       path={path[0]}
                                       render={props => <TitleBarContent {...props} title={path[1]} actionLink={path[2]} sectionLinks={path[3]} {...(path[4] || {})}/>}/>
                            );
                        })}
                    </Switch>
                )}
            </div>
        )
    }
}
