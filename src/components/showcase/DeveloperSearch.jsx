import React from 'react';
import _ from 'lodash';
import axios from 'axios';
import randomstring from 'randomstring';
import querystring from 'querystring';

import UserList from "../dashboard/network/UserList";
import SearchBox from "../core/SearchBox";
import Footer from "./elements/Footer";
import CustomInputGroup from "../core/CustomInputGroup";
import Button from "../core/Button";

import connect from '../../connectors/AuthConnector';

import algoliaUtils from '../utils/algolia';
import {ENDPOINT_LOG_SEARCH} from "../../actions/utils/api";
import {getNumSearches, updateSearches} from "../utils/search";
const freeEmailDomains = require("../../utils/free-email-domains");

let searchWatcher = null;

class DeveloperSearch extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            search: '',
            hasLoaded: false, isLoading: false,
            results: [], resultsFor: '', total: 0, currentPage: 0, maxPages: 0,
            emailUnlock: '', emailMore: '',
            shouldLoadMore: false,
            hasSearched: false
        };
    }

    componentDidMount() {
        this.getPeople();

        if(this.isLockable()) {
            const queryParams = querystring.parse((window.location.search || '').replace('?', ''));
            let query = queryParams.search || '';

            if(query) {
                this.refreshSearches();
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if(
            this.state.search !== prevState.search ||
            (this.props.Auth.isEmailVisitor && !prevProps.Auth.isEmailVisitor && this.state.shouldLoadMore)
        ) {
            this.getPeople();

            if(this.props.Auth.isEmailVisitor && !prevProps.Auth.isEmailVisitor && this.state.search) {
                this.logSearch();
            }
        }
    }

    isLockable() {
        const {Auth: {isAuthenticated, isEmailVisitor}} = this.props;
        return !isAuthenticated && !isEmailVisitor;
    }

    isLocked() {
        return getNumSearches() && this.isLockable();
    }

    refreshSearches() {
        updateSearches();
        this.setState({refreshKey: randomstring.generate()});
    }

    onSearch(search) {
        const self = this;
        this.setState({search});

        if(this.isLockable() && search) {
            if(searchWatcher) {
                clearTimeout(searchWatcher);
            }
            searchWatcher = searchWatcher = setTimeout(function () {
                self.refreshSearches();
            }, 4000);
        }
    }

    logSearch() {
        const {Auth: {isAuthenticated, isEmailVisitor}} = this.props, {search} = this.state;
        if(search && (isAuthenticated || isEmailVisitor)) {
            axios.post(ENDPOINT_LOG_SEARCH, {search}).then(res => {
                console.log(`Logged search: ${search}`);
            }).catch(err => {
                console.error(`Failed to log search: ${search}`);
            });
        }
    }

    getPeople() {
        return;
        if(this.state.search) {
            this.logSearch();
        }

        let self = this;
        self.setState({
            isLoading: true,
            hasLoaded: this.state.search === this.state.resultsFor?this.state.hasLoaded:false,
            shouldLoadMore: false, hasSearched: this.state.hasSearched || !!this.state.search
        });

        const resultsPerPage = this.isLocked()?9:50;

        algoliaUtils.index.search({
                query: this.state.search,
                hitsPerPage: resultsPerPage,
                page: this.state.hasLoaded && this.state.search === this.state.resultsFor?(this.state.currentPage+1):0,
            },
            (err, content) => {
                if (err) {
                    console.log(err);

                    self.setState({
                        isLoading: false,
                        hasLoaded: this.state.search === this.state.resultsFor?this.state.hasLoaded:false
                    });
                } else {
                    if(content.query === self.state.search) {
                        self.setState({
                            results: [...(content.query === this.state.resultsFor?this.state.results:[]), ...(content.hits || [])].map(item => {
                                return item.profile && item.profile.skills?{
                                    ...item,
                                    profile: {
                                        ...item.profile,
                                        skills: _.orderBy(
                                            (item.profile.skills|| []).map((skill, idx) => {
                                                return {
                                                    ...skill,
                                                    rank: item._highlightResult.profile.skills[idx].name.matchedWords.length
                                                };
                                            }),
                                            ['rank', 'name'], ['desc', 'asc']
                                        )
                                    }
                                }:item
                            }),
                            resultsFor: content.query,
                            isLoading: false,
                            hasLoaded: true,
                            total: content.nbHits,
                            maxPages: content.nbPages,
                            currentPage: content.page
                        });
                    }
                }
            }
        );
    }

    onChangeEmail(key, e) {
        this.setState({[key]: e.target.value});
    }

    onUnlock(loadMore=false, e) {
        if(e) {
            e.preventDefault();
        }

        const email = this.state[loadMore?'emailMore':'emailUnlock'];
        if(email) {
            const regex = new RegExp(`(${freeEmailDomains.map(domain => {return domain}).join('|')})$`, "g");

            if(regex.test(email)) {
                this.setState({[`${loadMore?'emailMore':'emailUnlock'}Error`]: 'Please enter a business email.'});
            } else {
                const {AuthActions} = this.props;
                AuthActions.authenticateEmailVisitor({email, via_search: true, search: this.state.search});

                if(loadMore) {
                    this.setState({shouldLoadMore: true});
                }
            }
        }
    }

    render() {
        const {results, total, isLoading, hasLoaded, currentPage, maxPages} = this.state,
            {Auth: {isVerifying}} = this.props;

        return (
            <div className="developer-search-page">
                <header className="height-30">
                    <div className="container">
                        <div className="showcase-title">Browse Africa's tech talent</div>

                        <div className="text-center">
                            {this.isLocked()?(
                                <form className="unlock-container" onSubmit={this.onUnlock.bind(this, false)}>
                                    <p className={this.state.emailUnlockError?"alert alert-danger":"font-weight-normal"}>Please submit a business email to enable the search function</p>
                                    <div className="unlock-widget">
                                        <CustomInputGroup variant="email"
                                                          required
                                                          onChange={this.onChangeEmail.bind(this, 'emailUnlock')}
                                                          disabled={isVerifying}/>
                                        <Button type="submit" disabled={isVerifying}>Unlock</Button>
                                    </div>
                                </form>
                            ):null}

                            <SearchBox branded={false}
                                       size="lg"
                                       isLocked={this.isLocked()}
                                       onChange={this.onSearch.bind(this)}/>
                        </div>
                    </div>
                </header>

                <div className="card-container">
                    <div className="container">
                        {this.state.search && !isLoading?(
                            <div className="result-count"><strong>{total || 'No'}</strong> results for <strong>{this.state.search}</strong></div>
                        ):null}

                        <UserList users={results}
                                  showHeader={false}
                                  isLoading={isLoading && !hasLoaded}
                                  isLoadingMore={isLoading && hasLoaded && !this.isLocked()}
                                  hasMore={currentPage < (maxPages - 1) && !this.isLocked()}
                                  onLoadMore={this.getPeople.bind(this)}/>

                        {this.isLocked() && currentPage < (maxPages - 1)?(
                            <form className="unlock-container" onSubmit={this.onUnlock.bind(this, true)}>
                                <p className={this.state.emailMoreError?"alert alert-danger":"font-weight-normal"}>Enter your business email to view more profiles</p>
                                <div className="unlock-widget">
                                    <CustomInputGroup variant="email"
                                                      required
                                                      onChange={this.onChangeEmail.bind(this, 'emailMore')}
                                                      disabled={isVerifying}/>
                                    <Button type="submit"
                                            disabled={isVerifying}>Load more</Button>
                                </div>
                            </form>
                        ):null}
                    </div>
                </div>

                <Footer/>
            </div>
        );
    }
}

export default connect(DeveloperSearch);
