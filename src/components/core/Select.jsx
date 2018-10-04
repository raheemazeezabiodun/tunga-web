import PropTypes from 'prop-types';
import React from 'react';

import {filterEventProps} from "./utils/events";
import {filterInputProps} from "./utils/forms";

export default class Select extends React.Component {
    static defaultProps = {
        options: [],
        placeholder: '-- Select --',
        grouped: false,
    };

    static propTypes = {
        className: PropTypes.string,
        options: PropTypes.array,
        selected: PropTypes.any,
        onChange: PropTypes.func,
        size: PropTypes.string,
        placeholder: PropTypes.string,
        grouped: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {selected: props.selected || props.value};
    }

    onChange(e) {
        let choice = e.target.value;
        this.setState({selected: choice});
        if(this.props.onChange) {
            this.props.onChange(choice);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.selected !== this.props.selected) {
            this.setState({selected: nextProps.selected});
        }
    }

    renderOptions(options) {
        return options.map(option => {
            let optionValue = option,
                optionName = option;

            if(Array.isArray(option)) {
                optionValue = option[0];
                optionName = option[1];
            }
            return (
                <option key={`option-${optionValue}`} value={optionValue}>{optionName}</option>
            );
        });
    }

    render() {
        return (
            <select className={`form-control ${this.props.className || ''} ${this.props.size ?`form-control-${this.props.size}`:''}`}
                    {...filterInputProps(this.props)}
                    {...filterEventProps(this.props)}
                    value={this.state.selected || ''}
                    onChange={this.onChange.bind(this)}>
                {this.props.placeholder?(
                    <option value="">{this.props.placeholder}</option>
                ):null}

                {this.props.grouped?(
                    this.props.options.map(group => {
                        let groupName = group,
                            groupOptions = group;

                        if(Array.isArray(group)) {
                            groupName = group[0];
                            groupOptions = group[1];
                        }

                        if(Array.isArray(groupOptions)) {
                            return (
                                <optgroup label={groupName}>
                                    {this.renderOptions(groupOptions)}
                                </optgroup>
                            );
                        }
                        return (
                            <option key={`option-${groupName}`} value={groupName}>{groupOptions}</option>
                        );
                    })
                ):this.renderOptions(this.props.options)}
            </select>
        );
    }
}
