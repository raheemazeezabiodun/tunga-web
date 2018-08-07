import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router';
import Dropzone from 'react-dropzone';

import FormComponent from './FormComponent';
import Progress from './status/Progress';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';

import {TASK_DOCUMENT_TYPES} from '../constants/Api';

let defaultState = {
    file: null,
    file_type: null,
    description: null,
};

export default class TaskDocument extends FormComponent {
    constructor(props) {
        super(props);
        this.state = defaultState;
    }

    onDrop(attachments) {
        this.setState({file: attachments[0]});
    }

    onAddAttachment() {
        this.refs.dropzone.open();
    }

    handleSubmit(e) {
        e.preventDefault();

        const {task, TaskActions} = this.props;
        TaskActions.createTaskDocument(
            task.id,
            {
                file_type: this.state.file_type,
                description: this.state.description,
            },
            this.state.file,
        );
    }

    render() {
        const {task, Task} = this.props;

        if (Task.detail.isSaved) {
            return (
                <div>
                    <div className="thank-you">
                        Document uploaded successfully!<br />
                        <i className="fa fa-check-circle status-icon" />
                        <div>
                            <Link
                                to={`/work/${Task.detail.task.id}`}
                                className="btn">
                                Go to workflow page
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="form-wrapper">
                {Task.detail.isRetrieving ? (
                    <Progress />
                ) : (
                    <div style={{marginTop: '20px'}}>
                        <form
                            onSubmit={this.handleSubmit.bind(this)}
                            name="document-form"
                            role="form"
                            ref="document_form">
                            <FormStatus
                                loading={Task.detail.isSaving}
                                success={Task.detail.isSaved}
                                message={'Document uploaded successfully!'}
                                error={Task.detail.error.document}
                            />

                            {Task.detail.error.document &&
                            Task.detail.error.document.file_type ? (
                                <FieldError
                                    message={
                                        Task.detail.error.document.file_type
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    File type
                                </label>
                                <select
                                    className="form-control"
                                    value={this.state.file_type}
                                    onChange={this.onInputChange.bind(
                                        this,
                                        'file_type',
                                    )}
                                    required>
                                    <option value="1">- Select -</option>
                                    {Object.keys(TASK_DOCUMENT_TYPES).map(
                                        file_type => {
                                            return (
                                                <option value={file_type}>
                                                    {
                                                        TASK_DOCUMENT_TYPES[
                                                            file_type
                                                        ]
                                                    }
                                                </option>
                                            );
                                        },
                                    )}
                                </select>
                            </div>

                            {Task.detail.error.document &&
                            Task.detail.error.document.file ? (
                                <FieldError
                                    message={Task.detail.error.document.file}
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">File</label>
                                <div>
                                    <Dropzone
                                        ref="dropzone"
                                        onDrop={this.onDrop.bind(this)}
                                        style={{display: 'none'}}
                                        multiple={false}>
                                        <div>
                                            Try dropping some files here, or
                                            click to select files to upload.
                                        </div>
                                    </Dropzone>
                                    {this.state.file ? (
                                        <div>
                                            <i className="fa fa-file-text-o" />{' '}
                                            {this.state.file.name}
                                        </div>
                                    ) : null}
                                    <button
                                        type="button"
                                        className="btn "
                                        style={{marginRight: '5px'}}
                                        onClick={this.onAddAttachment.bind(
                                            this,
                                        )}>
                                        <i className="fa fa-upload" /> Upload
                                        file
                                    </button>
                                </div>
                            </div>

                            {Task.detail.error.document &&
                            Task.detail.error.document.description ? (
                                <FieldError
                                    message={
                                        Task.detail.error.document.description
                                    }
                                />
                            ) : null}
                            <div className="form-group">
                                <label className="control-label">
                                    Description
                                </label>
                                <textarea
                                    placeholder="Description"
                                    className="form-control"
                                    ref="description"
                                    onChange={this.onInputChange.bind(
                                        this,
                                        'description',
                                    )}
                                    value={this.state.description}>
                                    {this.state.description}
                                </textarea>
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="btn"
                                    disabled={Task.detail.isSaving}>
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        );
    }
}

TaskDocument.propTypes = {
    task: PropTypes.object.isRequired,
};

TaskDocument.defaultProps = {
    task: {},
};
