import React from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as UserActions from '../actions/UserActions';
import * as TaskActions from '../actions/TaskActions';
import * as MessageActions from '../actions/MessageActions';
import * as SupportSectionActions from '../actions/SupportSectionActions';
import * as SupportPageActions from '../actions/SupportPageActions';

import {isAdmin} from '../utils/auth';

class SearchPage extends React.Component {
    renderChildren() {
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    User: this.props.User,
                    Task: this.props.Task,
                    Message: this.props.Message,
                    Support: this.props.Support,
                    UserActions: this.props.UserActions,
                    TaskActions: this.props.TaskActions,
                    MessageActions: this.props.MessageActions,
                    SupportActions: this.props.SupportActions,
                    search: this.props.Search.query,
                    hide_header: true,
                    selectionKey: `search${this.props.Search.query}`,
                });
            }.bind(this),
        );
    }

    render() {
        const {Search} = this.props;

        const search_count = Search.count[`search${Search.query}`] || 0;

        return (
            <div>
                {Search.query ? (
                    <h3 className="results">
                        {search_count ? search_count : 'Search'} results for "<strong>
                            {Search.query}
                        </strong>"
                    </h3>
                ) : null}
                <ul className="nav nav-pills nav-top-filter">
                    <li role="presentation">
                        <Link to="/search/people" activeClassName="active">
                            {isAdmin() ? 'People' : 'Developers'}
                        </Link>
                    </li>
                    <li role="presentation">
                        <Link to="/search/tasks" activeClassName="active">
                            Tasks
                        </Link>
                    </li>
                    <li role="presentation" style={{marginLeft: '10px'}}>
                        <Link to="/search/messages" activeClassName="active">
                            Messages
                        </Link>
                    </li>
                    <li role="presentation" style={{marginLeft: '10px'}}>
                        <Link to="/search/support" activeClassName="active">
                            Support
                        </Link>
                    </li>
                </ul>

                {Search.query ? (
                    this.renderChildren()
                ) : (
                    <div className="alert alert-info">
                        Search results will appear here
                    </div>
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        Search: state.Search,
        User: state.User,
        Task: state.Task,
        Message: state.Message,
        Support: state.Support,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        UserActions: bindActionCreators(UserActions, dispatch),
        TaskActions: bindActionCreators(TaskActions, dispatch),
        MessageActions: bindActionCreators(MessageActions, dispatch),
        SupportActions: {
            ...bindActionCreators(SupportSectionActions, dispatch),
            ...bindActionCreators(SupportPageActions, dispatch),
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
