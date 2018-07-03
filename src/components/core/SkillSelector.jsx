import PropTypes from 'prop-types';
import React from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import randomstring from 'randomstring';
import _ from 'lodash';

import InputGroup from './InputGroup';
import Icon from './Icon';

import { filterEventProps } from "./utils/events";
import {filterInputProps} from "./utils/forms";

import * as SkillActions  from "../../actions/SkillActions";

class SkillSelector extends React.Component {
    static defaultProps = {
        placeholder: 'Add skills or products',
        selectionKey: null,
    };

    static propTypes = {
        className: PropTypes.string,
        selected: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        onChange: PropTypes.func,
        size: PropTypes.string,
        placeholder: PropTypes.string,
        selectionKey: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            selected: this.processSelected(props.selected || props.value),
            selectionKey: props.selectionKey || randomstring.generate(),
            prevKey: null,
            showSuggestions: false,
            search: ''
        };
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if(!_.isEqual(this.state.selected, prevState.selected) && this.props.onChange) {
            this.props.onChange(this.state.selected);
        }
    }

    processSelected(selected) {
        let finalSelected = [];
        if(Array.isArray(selected)) {
            finalSelected = selected.map(skill => {
                if(typeof skill === 'object') {
                    return skill.name;
                } else {
                    return skill;
                }
            });
        } else if(typeof selected === 'string') {
            finalSelected = selected.split(',');
        }
        return finalSelected.map(skill => {
            return skill.trim();
        });
    }


    getSkills(filter) {
        const {SkillActions} = this.props;
        SkillActions.getSkills(filter, this.state.selectionKey, this.state.prevKey);
    }

    onChange(e) {
        let skill = e.target.value;
        this.getSkills({search: skill});
        this.setState({search: skill, showSuggestions: !!skill});
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.selected !== this.props.selected) {
            this.setState({selected: this.processSelected(nextProps.selected)});
        }
    }

    onSelectSkill(skill, e) {
        e.preventDefault();
        this.setState({search: '', showSuggestions: false, selected: Array.from(new Set([...this.state.selected, skill]))});
    }

    onRemoveSkill(skill, e) {
        e.preventDefault();
        let idx = this.state.selected.indexOf(skill);
        if(idx > -1) {
            this.setState({selected: Array.from(new Set([...this.state.selected.slice(0, idx), ...this.state.selected.slice(idx+1)]))});
        }
    }

    render() {
        return (
            <div className="tag-input">
                {this.state.selected && this.state.selected.length?(
                    <div className="selected">
                        {this.state.selected.map(skill => {
                            return (
                                <span key={`skill-${skill}`}
                                    className="selected-item">
                                    {skill}
                                    <a onClick={this.onRemoveSkill.bind(this, skill)}
                                        className="close">
                                        <Icon name="close" />
                                    </a>
                                </span>
                            );
                        })}
                    </div>
                ):null}
                <InputGroup className={this.props.className} prepend={<i className="tg-ic-tag" />}
                            size={this.props.size}
                            placeholder={this.props.placeholder}
                            {...filterInputProps(this.props)}
                            {...filterEventProps(this.props)}
                            selected={this.state.selected}
                            value={this.state.search}
                            onFocus={() => {this.setState({showSuggestions: !!this.state.search})}}
                            onChange={this.onChange.bind(this)}/>
                {this.state.showSuggestions?(
                    <div className="list-group suggestions">
                        {(this.props.Skill.skills[this.state.selectionKey] || []).map(skill => {
                            if(this.state.selected.indexOf(skill.name) > -1) {
                                return null;
                            }
                            return (
                                <a className="list-group-item"
                                   key={skill.id}
                                   onClick={this.onSelectSkill.bind(this, skill.name)}>
                                    {skill.name}
                                </a>
                            );
                        })}
                    </div>
                ):null}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        Skill: state.Skill
    };
}

function mapDispatchToProps(dispatch) {
    return {
        SkillActions: bindActionCreators(SkillActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SkillSelector);
