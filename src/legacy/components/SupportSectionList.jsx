import React from 'react';
import {Link} from 'react-router';
import Progress from './status/Progress';
import LoadMore from './status/LoadMore';

export default class SupportSectionList extends React.Component {
    componentDidMount() {
        this.props.SupportActions.listSupportSections();
    }

    render() {
        const {Support, SupportActions} = this.props;

        return (
            <div>
                <h2>Support</h2>
                {Support.Section.list.isFetching ? (
                    <Progress />
                ) : (
                    <div>
                        <div>
                            {Support.Section.list.sections.map(section => {
                                return (
                                    <div key={section.id}>
                                        <Link to={`/support/${section.slug}/`}>
                                            <i className="fa fa-caret-right" />{' '}
                                            {section.title}
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                        <LoadMore
                            url={Support.Section.list.next}
                            callback={SupportActions.listMoreSupportSections}
                            loading={Support.Section.list.isFetchingMore}
                        />
                        {Support.Section.list.sections.length ? null : (
                            <div className="alert alert-info">
                                No sections to display
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
