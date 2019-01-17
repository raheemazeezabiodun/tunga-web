import React from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';

import UserProfile from "../dashboard/network/UserProfile";
import UserDetailContainer from "../dashboard/network/UserDetailContainer";
import Avatar from "../core/Avatar";

import connect from '../../connectors/UserConnector';
import {isAuthenticated, isEmailVisitor} from "../utils/auth";
import {getNumDevViews, updateDevViews} from "../utils/search";

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

class Developer extends React.Component {

    componentDidMount() {
        if(!isAuthenticated() && !isEmailVisitor()) {
            if(getNumDevViews() >= 6) {
                /*
                const {history} = this.props;
                if(history) {
                    history.replace('/developers');
                }
                */
                window.location.href = '/developers?error=unlock';
            } else {
                updateDevViews();
            }
        }
    }

    render() {
        const {User, UserActions} = this.props;

        return (
            <div className="developer-page">
                <UserDetailContainer {...this.props}>

                    <DeveloperHeader/>

                    <UserProfile showHeader={false} User={User} UserActions={UserActions}/>

                    <DeveloperFooter/>

                    <div className="text-center text text-sm">
                        &copy; {moment().format('YYYY')} Tunga.io &mdash; All rights reserved.
                    </div>

                </UserDetailContainer>
            </div>
        );
    }

}

export default connect(Developer);
