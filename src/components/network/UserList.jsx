import PropTypes from 'prop-types';
import React from 'react';

import Button from '../core/Button';
import UserCard from './UserCard';

export default class UserList extends React.Component {
    static propTypes = {
        users: PropTypes.array,
        onLoadMore: PropTypes.func,
        isLoadingMore: PropTypes.bool,
        hasMore: PropTypes.bool,
    };

    render() {
        const {users, onLoadMore, hasMore, isLoadingMore} = this.props;

        return (
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

                {users.length && hasMore && !isLoadingMore?(
                    <div className="text-center">
                        <Button size="sm" onClick={onLoadMore}>Load More</Button>
                    </div>
                ):null}
            </div>
        );
    }
}
