import React from 'react';
import _ from 'lodash';

export default class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.onSearch = _.debounce(this.onSearch, 250);
        this.performSearch = _.debounce(this.performSearch, 250);
        this.state = {q: ''};
    }

    componentDidMount() {
        if (this.state.q) {
            this.performSearch();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.q != prevState.q) {
            this.performSearch();
        }
    }

    onSearch(e) {
        e.preventDefault();
        this.performSearch();
        return;
    }

    onSearchChange(e) {
        e.preventDefault();
        var q = e.target.value;
        this.setState({q});
    }

    UNSAFE_componentWillMount() {
        if (this.props.query) {
            this.setState({q: this.props.query});
        }
    }

    performSearch() {
        if (this.props.onSearch) {
            var filter = this.props.filter || {};
            this.props.onSearch({search: this.state.q, ...filter});
        }
    }

    render() {
        const {count, custom_class} = this.props;
        return (
            <div className="search-box">
                <form
                    name="search"
                    role="form"
                    onSubmit={this.onSearch.bind(this)}>
                    <div className={'input-group ' + custom_class}>
                        <span className="input-group-addon">
                            <i className="fa fa-search" />
                        </span>
                        <input
                            type="text"
                            name="q"
                            className="form-control"
                            placeholder={this.props.placeholder || 'Search'}
                            value={this.state.q}
                            onChange={this.onSearchChange.bind(this)}
                        />
                    </div>
                </form>
                {!this.props.hide_results && this.state.q ? (
                    <div className="results">
                        {count ? count : 'Search'} results for "<strong>
                            {this.state.q}
                        </strong>"
                    </div>
                ) : null}
            </div>
        );
    }
}
