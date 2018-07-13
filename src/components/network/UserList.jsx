import PropTypes from 'prop-types';
import React from 'react';

import UserCard from './UserCard';
import LoadMore from "../core/LoadMore";
import Progress from "../core/Progress";

export default class UserList extends React.Component {
    static propTypes = {
        users: PropTypes.array,
        onLoadMore: PropTypes.func,
        isLoading: PropTypes.bool,
        isLoadingMore: PropTypes.bool,
        hasMore: PropTypes.bool,
    };

    render() {
        const {users, onLoadMore, hasMore, isLoading, isLoadingMore} = this.props;

        return isLoading?(
            <Progress/>
        ):(
            users.length?(
                <div>
                    <div className="row card-list">
                        {users.map(user => {
                            return (
                                <div key={`user-card--${user.id}`} className="col-sm-4">
                                    <UserCard user={user}/>
                                </div>
                            );
                        })}
                    </div>

                    <LoadMore hasMore={hasMore} isLoadingMore={isLoadingMore} onLoadMore={onLoadMore}/>
                </div>
            ):null
        );
    }
}
