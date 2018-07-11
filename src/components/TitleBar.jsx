import React from 'react';
import {Switch, Route} from 'react-router-dom';
import moment from 'moment';

import TitleBarContent from './TitleBarContent';
import MyAccountOutput from './dashboard/MyAccountOutput';
import ProjectOutput from './dashboard/ProjectOutput';

export default class TitleBar extends React.Component {

    render() {
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
            ['/settings/company-profile', 'Company profile'], // PO and admin
            ['/settings/company-details', 'Company details'], // PO and admin
            ['/settings/experience', 'Experience'], // dev and PM
            ['/settings/payment', 'Payment settings'], // dev and PM
            ['/settings/account', 'Account'], // All
            ['/settings/privacy', 'Privacy settings'], // All
        ];

        return (
            <div className='titlebar'>
                <Switch>
                    {[
                        ['/onboard', 'Welcome to Tunga!'],
                        ['/dashboard', <div>Hi <MyAccountOutput field="display_name"/></div>, '/projects/new', null, {subTitle: moment().format('dddd, Do of MMMM')}],
                        ['/projects/new', 'Projects', null, [['/projects/new', 'Create new project']]],
                        ['/projects/:projectId', 'Projects', '/projects/new', [[(match) => { return match.url }, (match) => { return match.params.projectId?<ProjectOutput id={match.params.projectId} field="title"/>:'Project title' }]]],
                        ['/projects', 'Projects', '/projects/new'],
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
