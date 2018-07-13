import React from 'react';
import { Switch, Route } from 'react-router-dom';

import connect from '../../connectors/UserConnector';

import UserListContainer from './UserListContainer';
import UserList from './UserList';
import UserDetailContainer from './UserDetailContainer';
import UserProfile from "./UserProfile";


import {USER_TYPE_DEVELOPER} from "../../legacy/constants/Api";

const UserContainer = ({User, UserActions}) => {
    return (
        <React.Fragment>
            <Switch>
                <Route exact path="/network/:username" render={props => <UserDetailContainer {...props} username={props.match.params.username} User={User} UserActions={UserActions}><UserProfile/></UserDetailContainer>}/>
                {[
                    '/network/filter/:filter',
                    '/network',
                ].map(path => {
                    return (
                        <Route key={`user-container-path--${path}`} path={path} render={props => <UserListContainer {...props} User={User} UserActions={UserActions} filters={{type: USER_TYPE_DEVELOPER, filter: props.match.params.filter || null}}><UserList/></UserListContainer>}/>
                    );
                })}
            </Switch>
        </React.Fragment>
    );
};

export default connect(UserContainer);
