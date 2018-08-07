import React from 'react';
import {Link, IndexLink} from 'react-router';
import Progress from './status/Progress';
import LoadMore from './status/LoadMore';

export default class SupportPageDetail extends React.Component {
    componentDidMount() {
        this.props.SupportActions.retrieveSupportPage(this.props.params.page);
    }

    render() {
        const {Support} = this.props;
        const {page} = Support.Page.detail;

        return (
            <div>
                {Support.Page.detail.isRetrieving ? (
                    <Progress />
                ) : page.id ? (
                    <div>
                        <ol className="breadcrumb">
                            <li>
                                <Link to={`/support/`}>Support</Link>
                            </li>
                            <li>
                                <Link to={`/support/${page.section.slug}/`}>
                                    {page.section.title}
                                </Link>
                            </li>
                            <li className="active">{page.title}</li>
                        </ol>
                        <div
                            className="support-page"
                            dangerouslySetInnerHTML={{__html: page.content}}
                        />
                    </div>
                ) : (
                    <div className="alert alert-danger">
                        Support page not found
                    </div>
                )}
            </div>
        );
    }
}
