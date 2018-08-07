import React from 'react';
import {Link} from 'react-router';

export default class Attachments extends React.Component {
    render() {
        const {attachments} = this.props;

        return (
            <div className="attachments">
                {attachments.map(attachment => {
                    return (
                        <div key={attachment.id} className="file">
                            <a href={attachment.url} target="_blank">
                                <i className="fa fa-download" />{' '}
                                {attachment.name}{' '}
                                <strong>[{attachment.display_size}]</strong>
                            </a>
                        </div>
                    );
                })}
            </div>
        );
    }
}
