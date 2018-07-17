import React from 'react';
import {Switch, Route} from 'react-router-dom';
import moment from 'moment';

import TitleBarContent from './TitleBarContent';
import ProjectOutput from './dashboard/ProjectOutput';
import {isAdminOrPMOrClient} from "./utils/auth";

export default class TitleBar extends React.Component {

    render() {
        const {user} = this.props;

        let networkSections = [
            ['/network', 'Developers'],
            ['/network/filter/relevant', 'Relevant for me']
        ], paymentSections = [
            ['/payments/filter/pending-in', 'Pending payments'],
            ['/payments/filter/paid-in', 'Paid payments'],
            ['/payments/filter/pending-out', 'Pending payouts'], // dev, admin and PM
            ['/payments/filter/paid-out', 'Paid payouts'], // dev, admin and PM
        ], settingsSections = [
            ['/settings/profile', 'Profile'], // All
            ...(user.is_project_owner?[
                // Clients only
                ['/settings/company-profile', 'Company profile'],
                ['/settings/company-details', 'Company details']
            ]:[]),
            ...(user.is_project_owner?[]:[
                // Devs and PMs only
                ['/settings/experience', 'Experience'],
                ['/settings/payment', 'Payment settings'],
            ]),
            ['/settings/account', 'Account'], // All
            ['/settings/privacy', 'Privacy settings'], // All
        ];

        return (
            <div className='titlebar'>
                <Switch>
                    {[
                        ['/onboard', 'Welcome to Tunga!'],
                        ['/dashboard', <div>Hi {user.display_name}</div>, isAdminOrPMOrClient()?'/projects/new':null, null, {subTitle: moment().format('dddd, Do of MMMM')}],
                        ['/projects/new', 'Projects', null, [['/projects/new', 'Create new project']]],
                        ['/projects/:projectId', 'Projects', isAdminOrPMOrClient()?'/projects/new':null, [[(match) => { return match.url }, (match) => { return match.params.projectId?<ProjectOutput id={match.params.projectId} field="title"/>:'Project title' }, {exact: false}]]],
                        ['/projects', 'Projects', isAdminOrPMOrClient()?'/projects/new':null],
                        ['/network', 'Network', null, networkSections],
                        ['/payments', 'Payments', null, paymentSections],
                        ['/settings', 'Settings', null, settingsSections],
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
