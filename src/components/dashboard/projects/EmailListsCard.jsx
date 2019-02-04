import React from 'react';

import Button from '../../core/Button';
import { openModal } from '../../core/utils/modals';
import EmailThreadModal from './modals/EmailThread';

export default class EmailListCard extends React.Component {
    viewThread = () => {
        openModal(<EmailThreadModal {...this.props} />, '', true, {size: 'lg'})
    }
    render() {
        return (
            <div className="email-body-wrapper">
                <div className="email-body">
                    <strong>Name Sender (email@email)</strong> sent an email to <strong>Name receiver (emailAddress@receiver)</strong>
                </div>
                <div className="email-body">
                    On <strong>date</strong> at <strong>Timestamp</strong>
                </div>
                <div className="email-body">
                    <p><strong>Subject</strong></p>
                    <p>Content</p>
                </div>
                <Button className="btn-email-thread" onClick={() => this.viewThread()}>view full email</Button>
            </div>
        )
    }
}
