import React from 'react';
import {Link} from 'react-router';
import Progress from './status/Progress';

export default class SupportSectionPageList extends React.Component {
    componentDidMount() {
        this.props.SupportActions.retrieveSupportSection(
            this.props.params.section,
        );
    }

    render() {
        const {Support} = this.props;
        const {section} = Support.Section.detail;

        return (
            <div>
                {Support.Section.isRetrieving ? (
                    <Progress />
                ) : (
                    <div>
                        <ol className="breadcrumb">
                            <li>
                                <Link to={`/support/`}>Support</Link>
                            </li>
                            <li className="active">{section.title}</li>
                        </ol>
                        {section.pages ? (
                            section.pages.length ? (
                                <div>
                                    {section.pages.map(page => {
                                        return (
                                            <div key={page.id}>
                                                <Link
                                                    to={`/support/${
                                                        section.slug
                                                    }/${page.slug}/`}>
                                                    {page.title}
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="alert alert-danger">
                                    No support pages found
                                </div>
                            )
                        ) : null}
                    </div>
                )}
            </div>
        );
    }
}
