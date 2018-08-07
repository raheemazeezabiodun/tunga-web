import React from 'react';

import ShowcaseContainer from '../containers/ShowcaseContainer';
import ShowCaseFooter from '../containers/ShowCaseFooter';
import MetaTags from '../components/MetaTags';
import Progress from './status/Progress';
import moment from 'moment/moment';
import DanteWrapper from './DanteWrapper';

export default class BlogDetail extends React.Component {
    parseContent() {
        const blog = this.props.blog || {};
        if (blog.body && /^{.*}$/gi.test(blog.body)) {
            return JSON.parse(blog.body);
        }
        return null;
    }

    renderHeaderContent() {
        const {Blog} = this.props;
        const {blog} = Blog.detail;

        return (
            <div>
                {Blog.detail.isRetrieving ? (
                    <Progress />
                ) : blog.id ? (
                    <div className="blog-header">
                        <h1>{blog.title}</h1>
                        <div>
                            Author: {blog.created_by.display_name}
                            {blog.published_at
                                ? ` | Published: ${moment
                                      .utc(blog.published_at)
                                      .local()
                                      .format('D/MMM/YYYY')}`
                                : null}
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-danger">
                        blog post not found
                    </div>
                )}
            </div>
        );
    }

    render() {
        const {Blog} = this.props;
        const {blog} = Blog.detail;

        let meta_title = `Tunga | ${blog.title}`;
        let meta_description = blog.title;

        return (
            <ShowcaseContainer
                className="blog-page"
                headerContent={this.renderHeaderContent()}
                hasGlassNav={false}
                autoOpenChat={false}
                headerImage={blog.image}>
                <MetaTags title={meta_title} description={meta_description} />

                <div className="container">
                    <div className="blog-content">
                        {Blog.detail.isRetrieving ? (
                            <Progress />
                        ) : blog.id ? (
                            <div>
                                <DanteWrapper
                                    content={this.parseContent()}
                                    read_only={true}
                                />
                            </div>
                        ) : (
                            <div className="alert alert-danger">
                                blog post not found
                            </div>
                        )}
                    </div>
                </div>

                <ShowCaseFooter />
            </ShowcaseContainer>
        );
    }
}
