import React from 'react';
import connect from '../utils/connectors/BlogConnector';

class BlogContainer extends React.Component {
    renderChildren() {
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Blog: this.props.Blog,
                    BlogActions: this.props.BlogActions,
                });
            }.bind(this),
        );
    }

    render() {
        return <div>{this.renderChildren()}</div>;
    }
}

export default connect(BlogContainer);
