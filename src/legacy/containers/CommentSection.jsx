import React from 'react';
import connect from '../utils/connectors/CommentConnector';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/ActivityList';

class CommentSection extends React.Component {
    renderChildren() {
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Comment: this.props.Comment,
                    CommentActions: this.props.CommentActions,
                });
            }.bind(this),
        );
    }

    render() {
        return (
            <div className={this.props.className}>{this.renderChildren()}</div>
        );
    }
}

export default connect(CommentSection);
