import PropTypes from 'prop-types';
import React from 'react';

export default class BlogDetailContainer extends React.Component {
    componentDidMount() {
        this.props.BlogActions.retrieveBlog(this.getBlogId());
    }

    getBlogId() {
        const {blogId, params} = this.props;
        if (blogId) {
            return blogId;
        }
        if (params && params.blogId) {
            return params.blogId;
        }
        return null;
    }

    renderChildren() {
        const {Blog} = this.props;

        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Auth: this.props.Auth,
                    Blog: this.props.Blog,
                    BlogActions: this.props.BlogActions,
                    blog: this.props.Blog.detail.blog,
                    isRetrieving: Blog.detail.isRetrieving,
                    isSaving: Blog.detail.isSaving,
                    isSaved: Blog.detail.isSaved,
                    errors: Blog.detail.error,
                });
            }.bind(this),
        );
    }

    render() {
        return <div>{this.renderChildren()}</div>;
    }
}

BlogDetailContainer.propTypes = {
    blogId: PropTypes.number,
};

BlogDetailContainer.defaultProps = {
    blogId: null,
};
