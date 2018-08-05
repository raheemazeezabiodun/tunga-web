import React from 'react';
import Icon from "../core/Icon";

export default class Attachments extends React.Component {
    render() {
        const {attachments} = this.props;

        return (
            <div className="attachments">
                {attachments.map(attachment => {
                    return (
                        <div key={attachment.id} className="file">
                            <a href={attachment.url} target="_blank">
                                <Icon name="download" />{' '}
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
