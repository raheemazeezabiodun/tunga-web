import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router';

export default class TagList extends React.Component {
    render() {
        const {tags, linkPrefix, moreLink, showLinks} = this.props;
        const max = this.props.max || tags.length;
        const excess = tags.length - max;
        var tag_list = tags.slice(0, max);

        return (
            <div className="tag-list">
                {showLinks ? (
                    <span>
                        {tag_list.map((tag, idx) => {
                            return (
                                <Link
                                    key={tag.id}
                                    to={`${linkPrefix || '/work/skill/'}${
                                        tag.name
                                    }/`}>
                                    {tag.name}
                                    {idx < tag_list.length - 1 ? ',' : ''}{' '}
                                </Link>
                            );
                        })}
                        {excess > 0 ? (
                            <Link to={moreLink || '#'}> and {excess} more</Link>
                        ) : null}
                    </span>
                ) : (
                    <span>
                        {tag_list.map((tag, idx) => {
                            return (
                                <span key={tag.id}>
                                    {tag.name}
                                    {idx < tag_list.length - 1 ? ',' : ''}{' '}
                                </span>
                            );
                        })}
                        {excess > 0 ? <span> and {excess} more</span> : null}
                    </span>
                )}
            </div>
        );
    }
}

TagList.propTypes = {
    tags: PropTypes.array.isRequired,
    linkPrefix: PropTypes.string,
    moreLink: PropTypes.string,
    showLinks: PropTypes.bool,
};

TagList.defaultProps = {
    tags: [],
    showLinks: true,
};
