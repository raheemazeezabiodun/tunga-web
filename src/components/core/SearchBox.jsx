import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import querystring from 'querystring';
import randomstring from 'randomstring';

import CustomInputGroup from './CustomInputGroup';
import Avatar from "./Avatar";
import Icon from "./Icon";
import Progress from "./Progress";

import {filterEventProps} from "./utils/events";
import {filterInputProps} from "./utils/forms";

import * as UserActions from "../../actions/UserActions";
import * as ProjectActions from "../../actions/ProjectActions";
import * as InvoiceActions from "../../actions/InvoiceActions";

class SearchBox extends React.Component {
    static defaultProps = {
        branded: true
    };

    static propTypes = {
        className: PropTypes.string,
        placeholder: PropTypes.string,
        branded: PropTypes.bool,
        selectionKey: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.selectionKey = props.selectionKey || randomstring.generate();

        const queryParams = querystring.parse((window.location.search || '').replace('?', ''));
        let query = queryParams.search || '';

        this.state = {search: query};
        if(query) {
            this.search(query);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.search !== prevState.search) {
            this.search(this.state.search);
        }
    }

    getSearchKey(query) {
        return `${this.selectionKey}-${query}`;
    }

    searchKey() {
        return this.getSearchKey(this.state.search);
    }

    onChangeValue = (e) => {
        this.setState({search: e.target.value});
    };

    search(query) {
        const {SearchActions} = this.props;
        SearchActions.listUsers({search: query}, this.getSearchKey(query));
        SearchActions.listProjects({search: query}, this.getSearchKey(query));
        SearchActions.listInvoices({search: query}, this.getSearchKey(query));
    }

    render() {
        const {User, Project, Invoice} = this.props;
        let userIds = User.ids[this.searchKey()],
            projectIds = Project.ids[this.searchKey()],
            invoiceIds = Invoice.ids[this.searchKey()],
            isRetrievingUsers = User.isFetching[this.searchKey()],
            isRetrievingProjects = Project.isFetching[this.searchKey()],
            isRetrievingInvoices = Invoice.isFetching[this.searchKey()];

        let users = [],
            projects = [],
            invoices = [];

        if(userIds) {
            userIds.forEach(id => {
                users.push(User.users[id]);
            });
        }

        if(projectIds) {
            projectIds.forEach(id => {
                projects.push(Project.projects[id]);
            });
        }

        if(invoiceIds) {
            invoiceIds.forEach(id => {
                invoices.push(Invoice.invoices[id]);
            });
        }

        return (
            <div className="search-widget">
                <form>
                    <CustomInputGroup name="search"
                                      variant={`search${this.props.branded?'':'-plain'}`}
                                      className={this.props.className}
                                      placeholder={this.props.placeholder}
                                      value={this.state.search}
                                      autoComplete="off"
                                      {...filterInputProps(this.props)}
                                      {...filterEventProps(this.props)}
                                      onChange={this.onChangeValue}/>
                </form>

                {this.state.search?(
                    <div className="search-results">
                        {isRetrievingUsers && isRetrievingProjects && isRetrievingInvoices?(
                            <Progress/>
                        ):(
                            <div>
                                <div className="search-header">
                                    {isRetrievingUsers || isRetrievingProjects || isRetrievingInvoices?(
                                        <Progress/>
                                    ):(
                                        <div>
                                            <strong>{(User.count[this.searchKey()] + Project.count[this.searchKey()] + Invoice.count[this.searchKey()]) || 'No'}</strong> results for: <strong>{this.state.search}</strong>
                                        </div>
                                    )}
                                </div>

                                {isRetrievingUsers?(
                                    null
                                ):users.length?(
                                    <div className="result-category">
                                        <div className="category-title"><Icon name="avatar"/> People</div>
                                        {users.slice(0, 5).map(user => {
                                            return (
                                                <div>
                                                    <Link to={`/network/${user.username}`} className="result-item">
                                                        <Avatar image={user.avatar_url} size="sm"/> {user.display_name}
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ):null}

                                {isRetrievingProjects?(
                                    null
                                ):projects.length?(
                                    <div className="result-category">
                                        <div className="category-title"><Icon name="projects"/> Projects</div>
                                        {projects.slice(0, 5).map(project => {
                                            return (
                                                <div>
                                                    <Link to={`/projects/${project.id}`} className="result-item">
                                                        {project.title}
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ):null}

                                {isRetrievingInvoices?(
                                    null
                                ):invoices.length?(
                                    <div className="result-category">
                                        <div className="category-title"><Icon name="cash"/> Invoices</div>
                                        {invoices.slice(0, 5).map(invoice => {
                                            return (
                                                <div>
                                                    <Link to={`/projects/${invoice.project.id}/pay/${invoice.id}`} className="result-item">
                                                        {invoice.full_title}
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ):null}
                            </div>
                        )}
                    </div>
                ):null}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        User: state.User,
        Project: state.Project,
        Invoice: state.Invoice
    };
}

function mapDispatchToProps(dispatch) {
    return {
        SearchActions: {
            ...bindActionCreators(UserActions, dispatch),
            ...bindActionCreators(ProjectActions, dispatch),
            ...bindActionCreators(InvoiceActions, dispatch),
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
