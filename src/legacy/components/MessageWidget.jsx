import PropTypes from 'prop-types';
import React from 'react';

export default class MessageWidget extends React.Component {
    onAddAttachment() {
        if (this.props.onAddAttachment) {
            this.props.onAddAttachment();
        }
    }

    onBodyChange(e) {
        var body = e.target.value.trim();
        if (this.props.onBodyChange) {
            this.props.onBodyChange(body);
        }
        if (e.keyCode === 13 && !e.shiftKey) {
            this.onSend(e);
        }
    }

    onSend(e) {
        if (this.props.onSend) {
            this.props.onSend(e);
            // No overlay when visitor sends a chat
            window.tungaCanOpenOverlay = false;
        }
    }

    render() {
        return (
            <div className="message-widget">
                <div className="input-group">
                    {this.props.canUpload ? (
                        <span className="input-group-btn">
                            <button
                                type="button"
                                className="btn btn-borderless"
                                onClick={this.onAddAttachment.bind(this)}>
                                <i className="tunga-icon-create fa-3x" />
                            </button>
                        </span>
                    ) : null}
                    <input
                        type="text"
                        className="form-control"
                        placeholder={this.props.placeholder}
                        onKeyUp={this.onBodyChange.bind(this)}
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-send"
                    disabled={this.props.isSending}
                    onClick={this.onSend.bind(this)}>
                    <i className="fa fa-paper-plane" />
                </button>
            </div>
        );
    }
}

MessageWidget.propTypes = {
    onSend: PropTypes.func.isRequired,
    onBodyChange: PropTypes.func,
    onAddAttachment: PropTypes.func,
    isSending: PropTypes.bool,
    placeholder: PropTypes.string,
    canUpload: PropTypes.bool,
};

MessageWidget.defaultProps = {
    placeholder: 'Write your message here',
    canUpload: true,
};
