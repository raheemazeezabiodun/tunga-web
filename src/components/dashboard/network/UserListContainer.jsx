import React from 'react';
import PropTypes from 'prop-types';
import randomstring from 'randomstring';
import _ from 'lodash';

import {addPropsToChildren} from "../../core/utils/children";
import Progress from "../../core/Progress";

export default class UserListContainer extends React.Component  {

    static propTypes = {
        filters: PropTypes.object,
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
        this.getList();
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if(!_.isEqual(prevProps.filters, this.props.filters)) {
            this.getList();
        }
    }

    getList() {
        const {UserActions} = this.props;
        UserActions.listUsers({...(this.props.filters || {})}, this.state.selectionKey, this.state.prevKey);
    }

    renderChildren() {
        const {User, UserActions, children} = this.props,
            selectionKey = this.state.selectionKey;

        return addPropsToChildren(children, {
            users: (User.ids[selectionKey] || []).map(id => {
                return User.users[id];
            }),
            onLoadMore: () => {
                UserActions.listMoreUsers(User.next[selectionKey], selectionKey);
            },
            isLoading: User.isFetching[selectionKey],
            isLoadingMore: User.isFetchingMore[selectionKey],
            hasMore: !!User.next[selectionKey],
            UserActions
        });
    }

    render() {
        const {User} = this.props,
            selectionKey = this.state.selectionKey;
        return (
            <React.Fragment>
                {User.isFetching[selectionKey]?(
                    <Progress/>
                ):(
                    this.renderChildren()
                )}
            </React.Fragment>
        );
    }
}
