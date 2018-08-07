import React from 'react';
import Progress from './Progress';

export default class LoadMore extends React.Component {
    constructor(props) {
        super(props);
    }

    handleLoadMore() {
        if (!this.props.loading && this.props.callback) {
            this.props.callback(this.props.url);
        }
    }

    render() {
        return (
            <div style={{position: 'relative'}}>
                {this.props.url ? (
                    <div className="load-more">
                        {this.props.loading ? (
                            <Progress />
                        ) : (
                            <button
                                type="button"
                                className="btn btn-alt btn-sm"
                                onClick={this.handleLoadMore.bind(this)}>
                                <span
                                    className={
                                        'fa fa-angle-' +
                                        (this.props.direction == 'up'
                                            ? 'up'
                                            : 'down')
                                    }
                                />{' '}
                                {this.props.text || 'Load More'}
                            </button>
                        )}
                        {/*this.props.loading?null:(
                            <Waypoint onEnter={this.handleLoadMore.bind(this)} threshold={0.2}/>
                                )*/}
                    </div>
                ) : null}
            </div>
        );
    }
}
