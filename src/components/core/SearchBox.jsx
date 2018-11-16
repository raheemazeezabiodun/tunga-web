import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import querystring from 'querystring';
import randomstring from 'randomstring';
import _ from 'lodash';

import CustomInputGroup from './CustomInputGroup';
import Avatar from "./Avatar";
import Icon from "./Icon";
import Progress from "./Progress";

import {filterEventProps} from "./utils/events";
import {filterInputProps} from "./utils/forms";

import * as UserActions from "../../actions/UserActions";
import * as ProjectActions from "../../actions/ProjectActions";
import * as InvoiceActions from "../../actions/InvoiceActions";
import LoadMore from "./LoadMore";


class SearchBox extends React.Component {
    static defaultProps = {
        branded: true,
        disableResults: false,
        searchPath: '',
        disableForm: false,
        isLocked: false,
        delay: 250
    };

    static propTypes = {
        className: PropTypes.string,
        placeholder: PropTypes.string,
        branded: PropTypes.bool,
        selectionKey: PropTypes.string,
        size: PropTypes.string,
        onChange: PropTypes.func,
        disableResults: PropTypes.bool,
        disableForm: PropTypes.bool,
        searchPath: PropTypes.string,
        isLocked: PropTypes.bool,
        delay: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.selectionKey = props.selectionKey || randomstring.generate();

        const queryParams = querystring.parse((window.location.search || '').replace('?', ''));
        let query = queryParams.search || '';
        this.search = _.debounce(this.search, this.props.delay);

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
        const {onChange, disableResults} = this.props;
        if(onChange) {
            onChange(query);
        } else if(query && !disableResults) {
            let searchKey = this.getSearchKey(query);
            const {SearchActions} = this.props;
            SearchActions.listUsers({search: query, page_size: 3}, searchKey);
            SearchActions.listProjects({search: query, page_size: 3}, searchKey);
            SearchActions.listInvoices({search: query, page_size: 3}, searchKey);
        }
    }

    clearSearch = () => {
        this.setState({search: ''})
    };

    parseSearchEntity(Source, itemsKey, searchKey) {
        const {SearchActions} = this.props;

        return {
            items: (Source.ids[searchKey] || []).map(id => {
                return Source[itemsKey][id];
            }),
            onLoadMore: () => {
                SearchActions[`listMore${_.upperFirst(itemsKey)}`](Source.next[searchKey], searchKey);
            },
            isLoading: Source.isFetching[searchKey],
            isLoadingMore: Source.isFetchingMore[searchKey],
            hasMore: !!Source.next[searchKey],
            count: Source.count[searchKey]
        }
    }

    render() {
        const {User, Project, Invoice, onChange, disableResults, disableForm, searchPath} = this.props;

        let searchKey = this.searchKey(),
            users = this.parseSearchEntity(User, 'users', searchKey),
            projects = this.parseSearchEntity(Project, 'projects', searchKey),
            invoices = this.parseSearchEntity(Invoice, 'invoices', searchKey);

        const searchInput = (
            <CustomInputGroup name="search"
                              variant={`search${this.props.branded?'':'-plain'}`}
                              className={`${this.props.className || ''} ${this.props.size?`input-search-${this.props.size}`:''}`}
                              placeholder={this.props.placeholder}
                              value={this.state.search}
                              autoComplete="off"
                              {...filterInputProps(this.props)}
                              {...filterEventProps(this.props)}
                              prepend={this.props.isLocked?<Icon name="lock-alt" />:null}
                              disabled={this.props.isLocked}
                              onChange={this.onChangeValue}/>
        );

        return (
            <div className="search-widget">

                {disableForm?searchInput:(
                    <form method="get" action={searchPath || ''}>
                        {searchInput}
                    </form>
                )}

                {this.state.search && !onChange && !disableResults?(
                    <div className="search-results">
                        {users.isLoading && projects.isLoading && invoices.isLoading?(
                            <Progress/>
                        ):(
                            <div>
                                <div className="search-header">
                                    {users.isLoading || projects.isLoading || invoices.isLoading?(
                                        <Progress/>
                                    ):(
                                        <div>
                                            <strong>{(users.count + projects.count + invoices.count) || 'No'}</strong> results for: <strong>{this.state.search}</strong>
                                        </div>
                                    )}
                                </div>

                                <div className="results-wrapper">
                                    {users.isLoading?(
                                        null
                                    ):users.items.length?(
                                        <div className="result-category">
                                            <div className="category-title"><Icon name="avatar"/> People</div>
                                            {users.items.map(user => {
                                                return (
                                                    <div>
                                                        <Link to={`/network/${user.username}`}
                                                              className="result-item"
                                                              onClick={this.clearSearch}>
                                                            <Avatar image={user.avatar_url} size="sm"/> {user.display_name}
                                                        </Link>
                                                    </div>
                                                );
                                            })}
                                            <LoadMore hasMore={users.hasMore}
                                                      isLoadingMore={users.isLoadingMore}
                                                      onLoadMore={users.onLoadMore}
                                                      variant="outline-primary"/>
                                        </div>
                                    ):null}

                                    {projects.isLoading?(
                                        null
                                    ):projects.items.length?(
                                        <div className="result-category">
                                            <div className="category-title"><Icon name="projects"/> Projects</div>
                                            {projects.items.map(project => {
                                                return (
                                                    <div>
                                                        <Link to={`/projects/${project.id}`}
                                                              className="result-item"
                                                              onClick={this.clearSearch}>
                                                            {project.title}
                                                        </Link>
                                                    </div>
                                                );
                                            })}

                                            <LoadMore hasMore={projects.hasMore}
                                                      isLoadingMore={projects.isLoadingMore}
                                                      onLoadMore={projects.onLoadMore}
                                                      variant="outline-primary"/>
                                        </div>
                                    ):null}

                                    {invoices.isLoading?(
                                        null
                                    ):invoices.items.length?(
                                        <div className="result-category">
                                            <div className="category-title"><Icon name="cash"/> Payments</div>
                                            {invoices.items.map(invoice => {
                                                return (
                                                    <div>
                                                        <Link to={`/projects/${invoice.project.id}/pay`}
                                                              className="result-item"
                                                              onClick={this.clearSearch}>
                                                            {invoice.full_title}
                                                        </Link>
                                                    </div>
                                                );
                                            })}

                                            <LoadMore hasMore={invoices.hasMore}
                                                      isLoadingMore={invoices.isLoadingMore}
                                                      onLoadMore={invoices.onLoadMore}
                                                      variant="outline-primary"/>
                                        </div>
                                    ):null}
                                </div>
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
