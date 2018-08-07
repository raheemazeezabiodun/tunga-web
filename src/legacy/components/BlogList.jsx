import React from 'react';
import {Link, IndexLink} from 'react-router';
import moment from 'moment';

import Progress from './status/Progress';
import LoadMore from './status/LoadMore';
import GenericListContainer from '../containers/GenericListContainer';

import {getPayDetails} from '../utils/tasks';

export default class BlogList extends GenericListContainer {
    componentDidUpdate(prevProps, prevState) {
        super.componentDidUpdate(prevProps, prevState);

        if (
            prevProps.location &&
            this.props.location &&
            prevProps.location.pathname != this.props.location.pathname
        ) {
            this.getList();
        }

        if (prevProps.search != this.props.search) {
            this.setState({
                selection_key:
                    this.state.selection_key + (this.props.search || ''),
                prev_key: this.state.selection_key,
            });
        }
    }

    getList(filters) {
        this.props.BlogActions.listBlogs(
            {status: this.getFilter()},
            this.state.selection_key,
            this.state.prev_key,
        );
    }

    getFilter() {
        if (this.props.params && this.props.params.filter) {
            return this.props.params.filter;
        }
        return null;
    }

    render() {
        const {Blog, BlogActions} = this.props;
        const all_blogs = Blog.list.ids[this.state.selection_key] || [];

        return (
            <div>
                <h2 className="clearfix">
                    <div className="pull-left">Blog</div>
                    <Link
                        to="/blog/admin/new"
                        className="btn btn-grey btn-create pull-right">
                        <i className="fa fa-plus" /> Create a new blog post
                    </Link>
                </h2>

                <ul className="nav nav-pills nav-top-filter">
                    <li role="presentation">
                        <IndexLink to="/blog/admin" activeClassName="active">
                            All
                        </IndexLink>
                    </li>
                    <li role="presentation">
                        <Link
                            to="/blog/admin/filter/pending"
                            activeClassName="active">
                            Pending
                        </Link>
                    </li>
                    <li role="presentation">
                        <Link
                            to="/blog/admin/filter/published"
                            activeClassName="active">
                            Published
                        </Link>
                    </li>
                </ul>

                {Blog.list.isFetching ? (
                    <Progress />
                ) : (
                    <div>
                        {all_blogs.length ? (
                            <table className="table table-striped table-responsive">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Created</th>
                                        <th>Status</th>
                                        <th>Published On</th>
                                        <th>Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {all_blogs.map(id => {
                                        const blog = Blog.list.blogs[id];
                                        return (
                                            <tr key={blog.id}>
                                                <td>
                                                    <Link
                                                        to={`/blog/admin/${
                                                            blog.id
                                                        }/edit`}>
                                                        {blog.title}
                                                    </Link>
                                                </td>
                                                <td>
                                                    {
                                                        blog.created_by
                                                            .display_name
                                                    }
                                                </td>
                                                <td>
                                                    {moment
                                                        .utc(blog.created_at)
                                                        .local()
                                                        .format('D/MMM/YYYY')}
                                                </td>
                                                <td>
                                                    {blog.published
                                                        ? 'Published'
                                                        : 'Pending'}
                                                </td>
                                                <td>
                                                    {blog.published &&
                                                    blog.published_at
                                                        ? moment
                                                              .utc(
                                                                  blog.published_at,
                                                              )
                                                              .local()
                                                              .format(
                                                                  'D/MMM/YYYY',
                                                              )
                                                        : null}
                                                </td>
                                                <td>
                                                    <a
                                                        href={`/blog/${
                                                            blog.slug
                                                        }`}
                                                        target="_blank">
                                                        {blog.title}
                                                    </a>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="alert alert-info">
                                No blog posts found
                            </div>
                        )}
                        {all_blogs.length && Blog.list.next ? (
                            <LoadMore
                                url={Blog.list.next}
                                callback={x => {
                                    BlogActions.listMoreBlogs(
                                        x,
                                        this.state.selection_key,
                                    );
                                }}
                                loading={Blog.list.isFetchingMore}
                            />
                        ) : null}
                    </div>
                )}
            </div>
        );
    }
}
