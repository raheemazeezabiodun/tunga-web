import PropTypes from 'prop-types';
import React from 'react';
import {confirmable} from 'react-confirm';
import {Button} from 'react-bootstrap';

import Modal from './ModalShim';

class ConfirmDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {response: null};
    }

    onResponseChange(e) {
        this.setState({response: e.target.value});
    }

    render() {
        const {
            show,
            proceed,
            dismiss,
            cancel,
            confirmation,
            options
        } = this.props;
        let safe_options = options || {};

        return (
            <Modal
                show={show}
                onHide={dismiss}
                bsStyle="md"
                backdrop={options.mustRespond ? 'static' : true}
                keyboard={!options.mustRespond}>
                <Modal.Header closeButton={!options.mustRespond}>
                    {options.heading || ''}
                </Modal.Header>
                <Modal.Body>
                    <div>{confirmation}</div>
                    {options.isPrompt ? (
                        <div className="form-group">
                            <textarea
                                ref="response"
                                className="form-control"
                                placeholder={safe_options.placeholder || ''}
                                onChange={this.onResponseChange.bind(this)}
                            />
                        </div>
                    ) : null}
                </Modal.Body>
                <Modal.Footer>
                    {safe_options.hideCancel ? null : (
                        <Button onClick={() => cancel()} className="btn-alt">
                            {safe_options.cancel || 'Cancel'}
                        </Button>
                    )}
                    <Button
                        onClick={() => {
                            if (safe_options.isPrompt) {
                                if (this.state.response) {
                                    proceed(this.state.response);
                                }
                            } else {
                                proceed();
                            }
                        }}
                        disabled={
                            safe_options.isPrompt && !this.state.response
                        }>
                        {safe_options.ok || 'OK'}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ConfirmDialog.propTypes = {
    show: PropTypes.bool,
    proceed: PropTypes.func,
    cancel: PropTypes.func,
    dismiss: PropTypes.func,
    confirmation: PropTypes.string,
    options: PropTypes.object,
};

export default confirmable(ConfirmDialog);
