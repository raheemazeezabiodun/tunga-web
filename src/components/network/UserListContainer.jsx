import React from 'react';
import PropTypes from 'prop-types';
import randomstring from 'randomstring';
import _ from 'lodash';

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
        const {User, UserActions} = this.props,
            self = this,
            selectionKey = self.state.selectionKey;

        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    users: (User.ids[selectionKey] || []).map(id => {
                        return User.users[id];
                    }),
                    onLoadMore: () => {
                        UserActions.listMoreUsers(User.next[selectionKey], selectionKey);
                    },
                    isLoadingMore: User.isFetchingMore[selectionKey],
                    hasMore: !!User.next[selectionKey],
                    UserActions
                });
            }.bind(this),
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.renderChildren()}
            </React.Fragment>
        );
    }
}
