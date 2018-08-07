import PropTypes from 'prop-types';
import React from 'react';
import Dropzone from 'react-dropzone';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import {nl_to_br} from '../utils/html';
import MessageWidget from './MessageWidget';

export default class MessageForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {body: '', attachments: []};
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            (this.props.messageSaved && !prevProps.messageSaved) ||
            (this.props.uploadSaved && !prevProps.uploadSaved)
        ) {
            this.refs.message_form.reset();
            this.setState({body: '', attachments: []});
        }
    }

    onAddAttachment() {
        this.refs.dropzone.open();
    }

    onBodyChange(body) {
        this.setState({body});
    }

    onDrop(attachments) {
        var current = this.state.attachments;
        if (this.props.uploadCallback) {
            this.props.uploadCallback(attachments);
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        var body = nl_to_br(this.state.body);
        const attachments = this.state.attachments;
        if (body) {
            if (this.props.messageCallback) {
                this.props.messageCallback(body, attachments);
            }
        } else if (
            attachments &&
            attachments.length &&
            this.props.uploadCallback
        ) {
            this.props.uploadCallback(attachments);
        }
        return;
    }

    render() {
        const {Message} = this.props;
        return (
            <div>
                <form
                    onSubmit={this.handleSubmit.bind(this)}
                    name="compose"
                    role="form"
                    ref="message_form">
                    <FormStatus
                        loading={this.props.isSending}
                        error={this.props.errors}
                    />

                    <Dropzone
                        ref="dropzone"
                        onDrop={this.onDrop.bind(this)}
                        style={{display: 'none'}}>
                        <div>
                            Try dropping some files here, or click to select
                            files to upload.
                        </div>
                    </Dropzone>
                    {this.state.attachments && this.state.attachments.length ? (
                        <div className="file-queue">
                            {this.state.attachments.map(file => {
                                return (
                                    <div>
                                        <i className="fa fa-file-text-o" />{' '}
                                        {file.name}
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}

                    {this.props.errors && this.props.errors.body ? (
                        <FieldError
                            message={Message.detail.error.create.body}
                        />
                    ) : null}
                    <MessageWidget
                        onSend={this.handleSubmit.bind(this)}
                        onBodyChange={this.onBodyChange.bind(this)}
                        onAddAttachment={this.onAddAttachment.bind(this)}
                        isSending={this.props.isSending}
                        placeholder={this.props.placeholder}
                        canUpload={this.props.canUpload}
                    />
                </form>
            </div>
        );
    }
}

MessageForm.propTypes = {
    messageCallback: PropTypes.func,
    messageSaved: PropTypes.bool,
    uploadCallback: PropTypes.func,
    uploadSaved: PropTypes.bool,
    isSending: PropTypes.bool,
    error: PropTypes.object,
    placeholder: PropTypes.string,
    canUpload: PropTypes.bool,
};

MessageWidget.defaultProps = {
    placeholder: 'Write your message here',
    canUpload: true,
};
