import PropTypes from 'prop-types';
import React from 'react';
import {Row, Col} from 'reactstrap';

import InputGroup from './InputGroup';
import {filterEventProps} from "./utils/events";
import {filterInputProps} from "./utils/forms";
import IconButton from "./IconButton";
import Upload from "./Upload";

export default class MessageWidget extends React.Component {
    static defaultProps = {
        placeholder: 'Type message here',
        canUpload: true
    };

    static propTypes = {
        className: PropTypes.string,
        placeholder: PropTypes.string,
        canUpload: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {message: ''};
    }

    onKeyUp = (e) => {
        if (e.keyCode === 13 && !e.shiftKey) {
            this.onSendMessage(e);
        }
    };

    onChangeMessage = (e) => {
        this.setState({message: e.target.value});
    };

    onSendMessage = (e) => {
        if (this.props.onSendMessage) {
            this.props.onSendMessage(this.state.message);
        }
        this.setState({message: ''});
    };

    onUpload = (files) => {
        if (files && files.length && this.props.onUpload) {
            this.props.onUpload(files[0]);
        }
    };

    render() {
        return (
            <div className="message-widget">
                <Row>
                    {this.props.canUpload?(
                        <Col className="col-add-docs">
                            <Upload variant="icon" size="md" showSelected={false} onChange={this.onUpload}/>
                        </Col>
                    ):null}
                    <Col>
                        <InputGroup isAppendText={false}
                                    append={
                                        <IconButton variant="" name="paper-plane"
                                                    size="sm" onClick={this.onSendMessage}/>
                                    }
                                    placeholder={this.props.placeholder}
                                    {...filterInputProps(this.props)}
                                    {...filterEventProps(this.props)}
                                    onChange={this.onChangeMessage}
                                    onKeyUp={this.onKeyUp}
                                    value={this.state.message}/>
                    </Col>
                </Row>
            </div>
        );
    }
}
