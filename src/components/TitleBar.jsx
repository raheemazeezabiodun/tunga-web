import React from 'react';
import {Switch, Route} from 'react-router-dom';
import moment from 'moment';

import TitleBarContent from './TitleBarContent';
import ProjectOutput from './dashboard/ProjectOutput';
import {isAdmin, isAdminOrPM, isAdminOrPMOrClient, isClient, isDev} from "./utils/auth";

export default class TitleBar extends React.Component {

    render() {
        const {user, isLargeDevice} = this.props;

        let projectsSections = [
                ['/projects', 'Active Projects'],
                ['/projects/filter/archived', 'Archived Projects']
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
            <div className='titlebar'>
                <Switch>
                    {[
                        ['/onboard', 'Welcome to Tunga!'],
                        ['/dashboard', <div>Hi {user.display_name}</div>, null, null, {subTitle: moment().format('dddd, Do of MMMM')}],
                        ...(isLargeDevice?
                        [
                            ['/projects/new', 'Projects', null, [...projectsSections, ['/projects/new', 'Create new project']]],
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

            </div>
        )
    }
}
