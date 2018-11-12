import React from 'react';
import _ from 'lodash';

import UserList from "../dashboard/network/UserList";
import SearchBox from "../core/SearchBox";
import Footer from "./elements/Footer";
import CustomInputGroup from "../core/CustomInputGroup";
import Button from "../core/Button";

import connect from '../../connectors/UserConnector';

import algoliaUtils from '../utils/algolia';
import {isAuthenticated} from "../utils/auth";

class DeveloperSearch extends React.Component {

    constructor(props) {
        super(props);

        this.state = {search: '', hasLoaded: false, isLoading: false, results: [], resultsFor: '', total: 0, currentPage: 0, maxPages: 0};
    }

    componentDidMount() {
        this.getPeople();
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if(this.state.search !== prevState.search) {
            this.getPeople();
        }
    }

    onSearch(search) {
        this.setState({search});
    }

    getPeople() {
        let self = this;
        self.setState({
            isLoading: true,
            hasLoaded: this.state.search === this.state.resultsFor?this.state.hasLoaded:false
        });

        const isLocked = !isAuthenticated(),
            resultsPerPage = isLocked?9:50;

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
                            results: [...(content.query === this.state.resultsFor?this.state.results:[]), ...(content.hits || [])],
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

    onUnlock(loadMore=false, e) {
        if(e) {
            e.preventDefault();
        }
    }

    render() {
        const {results, total, isLoading, hasLoaded, currentPage, maxPages} = this.state, isLocked = !isAuthenticated();

        return (
            <div className="developer-search-page">
                <header className="height-30">
                    <div className="container">
                        <div className="showcase-title">Browse Africa's tech talent</div>

                        <div className="text-center">
                            {isLocked?(
                                <form className="unlock-container" onSubmit={this.onUnlock.bind(this, false)}>
                                    <p className="font-weight-normal">Please submit a business email to enable the search function</p>
                                    <div className="unlock-widget">
                                        <CustomInputGroup variant="email" required/>
                                        <Button type="submit">Unlock</Button>
                                    </div>
                                </form>
                            ):null}

                            <SearchBox branded={false}
                                       size="lg"
                                       isLocked={isLocked}
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
                                  isLoadingMore={isLoading && hasLoaded && !isLocked}
                                  hasMore={currentPage < (maxPages - 1) && !isLocked}
                                  onLoadMore={this.getPeople.bind(this)}/>

                        {isLocked && currentPage < (maxPages - 1)?(
                            <form className="unlock-container" onSubmit={this.onUnlock.bind(this, true)}>
                                <p className="font-weight-normal">Enter your email to view more profiles</p>
                                <div className="unlock-widget">
                                    <CustomInputGroup variant="email" required/>
                                    <Button type="submit" onClick={this.getPeople.bind(this)}>Load more</Button>
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
