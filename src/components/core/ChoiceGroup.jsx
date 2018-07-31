import PropTypes from 'prop-types';
import React from 'react';

import Button from './Button';
import Icon from './Icon';

import {filterEventProps} from "./utils/events";

export default class ChoiceGroup extends React.Component {
    static defaultProps = {
        variant: 'choice',
        choices: [],
        disabled: false
    };

    static propTypes = {
        className: PropTypes.string,
        choices: PropTypes.array,
        selected: PropTypes.any,
        onChange: PropTypes.func,
        type: PropTypes.string,
        variant: PropTypes.string,
        size: PropTypes.string,
        disabled: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {selected: props.selected};
    }

    onChange(choice) {
        if(!this.props.disabled) {
            this.setState({selected: choice});
            if(this.props.onChange) {
                this.props.onChange(choice);
            }
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.selected !== this.props.selected) {
            this.setState({selected: nextProps.selected});
        }
    }

    render() {
        return (
            <div className={`btn-group choice-group ${this.props.className || ''}`}>
                {this.props.choices.map(choice => {
                    let choiceValue = choice,
                        choiceName = choice,
                        choiceIcon = null;

                    if(Array.isArray(choice)) {
                        choiceValue = choice[0];
                        choiceName = choice[1];
                        choiceIcon = choice[2];
                    }

                    return (
                        <Button key={`choice-${choiceValue}`} variant={this.props.variant || 'choice'}
                                size={this.props.size}
                                className={`${this.state.selected === choiceValue?'active':''}`}
                                {...filterEventProps(this.props)}
                                onClick={this.onChange.bind(this, choiceValue)}>
                            {choiceName}
                            {choiceIcon && this.props.variant === 'card'?(
                                <Icon name={choiceIcon} size={'lg'} className="icon"/>
                            ):null}
                         </Button>
                    );
                })}
            </div>
        );
    }
}
