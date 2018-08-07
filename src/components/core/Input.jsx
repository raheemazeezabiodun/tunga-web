import PropTypes from 'prop-types';
import React from 'react';
import {addEventListeners, INPUT_EVENTS} from "./utils/events";
import {filterInputProps} from "./utils/forms";

export default class Input extends React.Component {
    static defaultProps = {
        type: 'text'
    };

    static propTypes = {
        type: PropTypes.string,
        className: PropTypes.string,
        placeholder: PropTypes.string,
        size: PropTypes.string,
    };

    render() {
        return (
            <input type={this.props.type}
                   className={`form-control ${this.props.className || ''} ${this.props.size?`form-control-${this.props.size}`:''}`}
                   placeholder={this.props.placeholder}
                   {...filterInputProps(this.props)}
                   {...addEventListeners(INPUT_EVENTS, this.props)}/>
        );
    }
}
