import React from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';

import UserProfile from "../dashboard/network/UserProfile";
import UserDetailContainer from "../dashboard/network/UserDetailContainer";
import Avatar from "../core/Avatar";

import connect from '../../connectors/UserConnector';

const Developer = (props) => {

    const DeveloperHeader = ({user}) => {
        return (
            <div>
                <header className="height-30">
                    <div className="container text-center">
                        <div className="name">{user.display_name}</div>
                        <div className="location">{user.profile?user.profile.location:''}</div>
                    </div>
                </header>

                <div className="developer-avatar">
                    <Avatar image={user.avatar_url} size="xxxl"/>
                </div>
            </div>
        );
    };

    const DeveloperFooter = ({user}) => {
        return (
            <div className="text-center">
                <Link to='/start' className="cta btn btn-primary btn-xl">Hire {user.first_name}</Link>
            </div>
        );
    };

    return (
        <div className="developer-page">
            <UserDetailContainer {...props}>
                <DeveloperHeader/>

                <UserProfile showHeader={false} User={props.User} UserActions={props.UserActions}/>

                <DeveloperFooter/>

                <div className="text-center text text-sm">
                    &copy; {moment().format('YYYY')} Tunga.io &mdash; All rights reserved.
                </div>

            </UserDetailContainer>
        </div>
    );
};

export default connect(Developer);
