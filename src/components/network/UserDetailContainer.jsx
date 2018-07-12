import React from 'react';
import PropTypes from 'prop-types';
import randomstring from 'randomstring';

import {addPropsToChildren} from "../core/utils/children";

export default class UserDetailContainer extends React.Component  {

    static propTypes = {
        username: PropTypes.string,
        selectionKey: PropTypes.string,
    };

    static defaultProps = {
        filters: {},
        selectionKey: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            selectionKey: props.selectionKey || randomstring.generate(),
            prevKey: null,
        };
    }

    componentDidMount() {
        this.getUser();
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if(prevProps.username !== this.props.username) {
            this.getUser();
        }
    }

    getUser() {
        const {username, UserActions, User} = this.props;
        if(username && !User.usernameToId[username] && !User.users[User.usernameToId[username]]) {
            UserActions.retrieveUser(username);
        }
    }

    renderChildren() {
        const {username, User, UserActions, children} = this.props;

        return addPropsToChildren(children, {
            user: User.users[User.usernameToId[username]],
            UserActions
        });
    }

    render() {
        const {username, User} = this.props;

        let user = User.users[User.usernameToId[username]];

        return user?(
            <React.Fragment>
                {this.renderChildren()}
            </React.Fragment>
        ):null;
    }
}
