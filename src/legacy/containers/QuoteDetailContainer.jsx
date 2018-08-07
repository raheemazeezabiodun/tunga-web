import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';

momentLocalizer(moment);

export default class QuoteDetailContainer extends React.Component {
    componentDidMount() {
        this.props.QuoteActions.retrieveQuote(this.getQuoteId());
    }

    componentDidUpdate(prevProps, prevState) {
        const {taskId, editToken} = this.props;
        if (
            this.props.quoteId != prevProps.quoteId ||
            !_.isEqual(this.props.params, prevProps.params)
        ) {
            this.props.QuoteActions.retrieveQuote(this.getQuoteId());
        }
    }

    getQuoteId() {
        const {quoteId, params} = this.props;
        if (quoteId) {
            return quoteId;
        }
        if (params && params.quoteId) {
            return params.quoteId;
        }
        return null;
    }

    renderChildren() {
        const {Quote} = this.props;

        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Auth: this.props.Auth,
                    Quote: this.props.Quote,
                    QuoteActions: this.props.QuoteActions,
                    quote: this.props.Quote.detail.quote,
                    isRetrieving: Quote.detail.isRetrieving,
                    isSaving: Quote.detail.isSaving,
                    isSaved: Quote.detail.isSaved,
                    errors: Quote.detail.error,
                    task: this.props.task,
                });
            }.bind(this),
        );
    }

    render() {
        const task = this.props.task || {};

        return (
            <div>
                <div className="sprint-head clearfix">
                    <div className="pull-right">
                        <Link
                            to={`/work/${task.id}/planning/new`}
                            className="btn btn-grey btn-create"
                            activeClassName="active">
                            <i className="fa fa-plus" /> Create a sprint
                        </Link>
                    </div>
                    {task && task.sprints && task.sprints.length ? (
                        <div className="nav-top-filter pull-left">
                            {task.sprints.map(sprint => {
                                let isCurrentYear =
                                        moment
                                            .utc(sprint.start_date)
                                            .local()
                                            .format('YYYY') ==
                                        moment()
                                            .local()
                                            .format('YYYY'),
                                    isSameYear =
                                        moment
                                            .utc(sprint.start_date)
                                            .local()
                                            .format('YYYY') ==
                                        moment
                                            .utc(sprint.end_date)
                                            .local()
                                            .format('YYYY');
                                return (
                                    <Link
                                        to={`/work/${task.id}/planning/${
                                            sprint.id
                                        }`}
                                        className="btn"
                                        activeClassName="active">
                                        {moment
                                            .utc(sprint.start_date)
                                            .local()
                                            .format(
                                                `Do MMM${
                                                    isCurrentYear || isSameYear
                                                        ? ''
                                                        : ' YYYY'
                                                }`,
                                            )}{' '}
                                        -{' '}
                                        {moment
                                            .utc(sprint.end_date)
                                            .local()
                                            .format(
                                                `Do MMM${
                                                    isCurrentYear ? '' : ' YYYY'
                                                }`,
                                            )}
                                    </Link>
                                );
                            })}
                        </div>
                    ) : null}
                </div>
                {this.renderChildren()}
            </div>
        );
    }
}

QuoteDetailContainer.propTypes = {
    quoteId: PropTypes.number,
};

QuoteDetailContainer.defaultProps = {
    quoteId: null,
};
