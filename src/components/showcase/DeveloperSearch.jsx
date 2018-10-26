import React from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';

import UserList from "../dashboard/network/UserList";
import UserListContainer from "../dashboard/network/UserListContainer";
import SearchBox from "../core/SearchBox";
import Footer from "./elements/Footer";

import connect from '../../connectors/UserConnector';
import Progress from "../core/Progress";

import algoliaUtils from '../utils/algolia';

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

        const resultsPerPage = 50;

        algoliaUtils.index.search({
                query: this.state.search,
                hitsPerPage: resultsPerPage,
                page: this.state.hasLoaded && this.state.search === this.state.resultsFor?(this.state.currentPage+1):0,
            },
            (err, content) => {
                if (err) throw err;

                if(content.query === self.state.search) {
                    console.log(content);

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
        );
    }

    render() {
        const {results, total, isLoading, hasLoaded, currentPage, maxPages} = this.state;

        return (
            <div className="developer-search-page">
                <header className="height-30">
                    <div className="container">
                        <div className="showcase-title">Browse Africa's tech talent</div>

                        <div className="text-center">
                            <SearchBox branded={false} onChange={this.onSearch.bind(this)} size="lg"/>
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
                                  isLoadingMore={isLoading && hasLoaded}
                                  hasMore={currentPage < (maxPages - 1)}
                                  onLoadMore={this.getPeople.bind(this)}/>
                    </div>
                </div>

                <Footer/>
            </div>
        );
    }
}

export default connect(DeveloperSearch);
