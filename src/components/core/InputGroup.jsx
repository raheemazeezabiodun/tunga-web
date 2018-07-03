import PropTypes from 'prop-types';
import React from 'react';

import Input from './Input';
import {filterEventProps} from "./utils/events";
import {filterInputProps} from "./utils/forms";

export default class InputGroup extends React.Component {
    static defaultProps = {
        isPrependText: true,
        isAppendText: true
    };

    static propTypes = {
        type: PropTypes.string,
        className: PropTypes.string,
        placeholder: PropTypes.string,
        prepend: PropTypes.object,
        append: PropTypes.object,
        isPrependText: PropTypes.bool,
        isAppendText: PropTypes.bool,
        size: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {focus: false};
    }

    onChangeFocus(focus) {
        this.setState({focus});
        if(this.props.onFocus) {
            this.props.onFocus();
        }
    }

    render() {
        return (
            <div className={`input-group ${this.props.className || ''} ${this.state.focus?'state-focus':''}`}>
                {this.props.prepend?(
                    <span className="input-group-prepend">
                        {this.props.isPrependText?(
                            <span className="input-group-text">
                                {this.props.prepend}
                            </span>
                        ):(
                            this.props.prepend
                        )}
                    </span>
                ):null}
                <Input
                    type={this.props.type}
                    className="form-control"
                    size={this.props.size}
                    placeholder={this.props.placeholder}
                    {...filterInputProps(this.props)}
                    {...filterEventProps(this.props)}
                    onFocus={this.onChangeFocus.bind(this, true)}
                    onBlur={this.onChangeFocus.bind(this, false)}/>
                {this.props.append?(
                    <span className="input-group-prepend">
                        {this.props.isAppendText?(
                            <span className="input-group-text">
                                {this.props.append}
                            </span>
                        ):(
                            this.props.append
                        )}
                    </span>
                ):null}
            </div>
        );
    }
}
