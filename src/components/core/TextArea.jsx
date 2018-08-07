import PropTypes from 'prop-types';
import React from 'react';

import {addEventListeners, INPUT_EVENTS} from './utils/events';
import {filterInputProps} from "./utils/forms";

export default class TextArea extends React.Component {
    static defaultProps = {
        type: 'text'
    };

    static propTypes = {
        type: PropTypes.string,
        className: PropTypes.string,
        placeholder: PropTypes.string,
    };

    render() {
        return (
            <textarea className={`form-control ${this.props.className || ''}`}
                      placeholder={this.props.placeholder}
                      {...filterInputProps(this.props)}
                      {...addEventListeners(INPUT_EVENTS, this.props)}>
                {this.props.children}
            </textarea>
        );
    }
}
