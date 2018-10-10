import PropTypes from 'prop-types';
import React from 'react';
import {Provider} from 'react-redux';
import {LOCATION_CHANGE} from "react-router-redux";
import {confirmable} from 'react-confirm';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import Button from './Button';
import TextArea from './TextArea';

import store from '../../store';
import IconButton from "./IconButton";

class GenericModal extends React.Component {
    static propTypes = {
        show: PropTypes.bool,
        proceed: PropTypes.func,
        cancel: PropTypes.func,
        dismiss: PropTypes.func,
        modalContent: PropTypes.any,
        options: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {response: null};
    }

    componentDidMount() {
        store.dispatch({type: LOCATION_CHANGE});
    }

    toggle() {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
    }

    onResponseChange(e) {
        this.setState({response: e.target.value});
    }

    renderModalContent() {
        const {
            proceed,
            dismiss,
            cancel,
            modalContent
        } = this.props;

        return (typeof modalContent === 'string')?
            (modalContent):(
                React.cloneElement(
                    modalContent,
                    {proceed,  dismiss, cancel}
                )
            );
    }

    render() {
        const {
            show,
            proceed,
            dismiss,
            cancel,
            options
        } = this.props;
        let safe_options = options || {};

        return (
            <Provider store={store}>
                <Modal
                    isOpen={show}
                    toggle={dismiss}
                    className={`${safe_options.size?`modal-${safe_options.size}`:''} ${safe_options.className || ''}`}
                    backdrop={safe_options.mustRespond ? 'static' : true}
                    keyboard={!safe_options.mustRespond}>
                    {!options.mustRespond || safe_options.title?(
                        <ModalHeader toggle={null}>
                            {safe_options.title || ''}
                            {safe_options.mustRespond?null:(
                                <IconButton name="close" size="sm" className="close" onClick={dismiss}/>
                            )}
                        </ModalHeader>
                    ):null}
                    <ModalBody>
                        <div>{this.renderModalContent()}</div>
                        {safe_options.isPrompt ? (
                            <div className="form-group">
                            <TextArea onChange={this.onResponseChange.bind(this)}
                            />
                            </div>
                        ) : null}
                    </ModalBody>
                    {safe_options.hideActions?null:(
                        <ModalFooter>
                            {safe_options.hideCancel ? null : (
                                <Button onClick={() => cancel()} variant="secondary">
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
                        </ModalFooter>
                    )}
                </Modal>
            </Provider>
        );
    }
}

export default confirmable(GenericModal);
