import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import randomstring from 'randomstring';

import connect from '../utils/connectors/SkillSelectionConnector';

class SkillSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            skill: '',
            skills: [],
            suggested: [],
            selection_key: props.selectionKey || randomstring.generate(),
            prev_key: null,
        };
        this.handleGetSuggestions = _.debounce(this.handleGetSuggestions, 250);
    }

    componentDidMount() {
        const {SkillSelectionActions, skills, suggested} = this.props;
        SkillSelectionActions.invalidateSkillSuggestions();
        SkillSelectionActions.clearSkillSelections();

        if (skills && Array.isArray(skills)) {
            this.setState({
                skills: Array.from(new Set([...this.state.skills, ...skills])),
            });
        }

        if (suggested && Array.isArray(suggested)) {
            this.setState({suggested});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {onChange} = this.props;
        const {SkillSelectionActions, skills, suggested} = this.props;

        let new_state = {};
        if (
            skills &&
            Array.isArray(skills) &&
            !_.isEqual(prevProps.skills, skills)
        ) {
            new_state.skills = Array.from(
                new Set([...this.state.skills, ...skills]),
            );
        }

        if (
            prevProps.suggested != suggested &&
            suggested &&
            Array.isArray(suggested)
        ) {
            new_state.suggested = suggested;
        }

        if (this.props.reset && !prevProps.reset) {
            new_state.skills = this.props.skills || [];
        }

        if (!_.isEqual(new_state, {})) {
            this.setState(new_state);
        }
    }

    handleComponentClick(e) {
        e.stopPropagation();
    }

    handleGetSuggestions() {
        const {SkillSelectionActions} = this.props;
        SkillSelectionActions.getSkillSuggestions(
            {search: this.state.skill},
            this.state.selection_key,
            this.state.prev_key,
        );
    }

    handleRemoveSkill(skill) {
        var idx = this.state.skills.indexOf(skill);
        if (idx > -1) {
            const {onChange} = this.props;
            let new_skills = Array.from(
                new Set([
                    ...this.state.skills.slice(0, idx),
                    ...this.state.skills.slice(idx + 1),
                ]),
            );
            if (onChange) {
                onChange(new_skills);
            }
            this.setState({skills: new_skills});
        }
    }

    handleSelectSkill(skill) {
        const {SkillSelectionActions, onChange} = this.props;
        SkillSelectionActions.invalidateSkillSuggestions();
        let new_skills = Array.from(new Set([...this.state.skills, skill]));
        if (onChange) {
            onChange(new_skills);
        }
        this.setState({skill: '', skills: new_skills});
    }

    handleSkillChange = e => {
        const {SkillSelectionActions} = this.props;
        var skill = e.target.value;
        this.setState({skill: skill});
        if (e.key === 'Enter') {
            e.preventDefault();
            this.handleSelectSkill(skill);
        }
        if (!skill) {
            SkillSelectionActions.invalidateSkillSuggestions();
            return;
        }
        this.handleGetSuggestions();
    };

    render() {
        const {
            SkillSelection,
            title,
            titleSuggestions,
            showTitle,
            showInstruction,
            tagName,
        } = this.props;

        return (
            <div
                className="skill-selector tag-selector"
                onClick={this.handleComponentClick.bind(this)}>
                <div className="selections">
                    {showTitle &&
                    this.state.suggested &&
                    this.state.suggested.length ? (
                        <label className="control-label">
                            {title || 'Skills or products'}
                        </label>
                    ) : null}
                    {this.state.skills && this.state.skills.length ? (
                        <div>
                            {this.state.skills.map(skill => {
                                return (
                                    <div
                                        key={skill}
                                        className="list-group-item selected-item">
                                        {skill}
                                        <a
                                            onClick={this.handleRemoveSkill.bind(
                                                this,
                                                skill,
                                            )}
                                            className="close">
                                            <i className="fa fa-remove" />
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    ) : showInstruction ? (
                        <div className="alert alert-info">
                            {this.state.suggested && this.state.suggested.length
                                ? 'Click on some suggestions or a'
                                : 'A'}dd some {tagName}s
                        </div>
                    ) : null}
                </div>
                {this.state.suggested && this.state.suggested.length ? (
                    <div className="selections">
                        <label className="control-label">
                            {titleSuggestions || 'Quick Suggestions'}
                        </label>
                        {this.state.suggested.map(skill => {
                            if (this.state.skills.indexOf(skill) > -1) {
                                return null;
                            }
                            return (
                                <div
                                    key={skill}
                                    className="list-group-item selected-item">
                                    <a
                                        onClick={this.handleSelectSkill.bind(
                                            this,
                                            skill,
                                        )}>
                                        {skill}
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                ) : null}

                <div className="tag-input">
                    <div className="input-group">
                        <span className="input-group-addon">
                            <i className="tunga-icon-tag" />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={`Type here to add ${tagName}s`}
                            onChange={this.handleSkillChange}
                            onKeyPress={this.handleSkillChange}
                            value={this.state.skill}
                        />
                    </div>

                    <div className="list-group suggestions">
                        {SkillSelection.isValid
                            ? (
                                  SkillSelection.suggestions[
                                      this.state.selection_key || 'default'
                                  ] || []
                              ).map(skill => {
                                  return (
                                      <a
                                          className="list-group-item"
                                          key={skill.id}
                                          onClick={this.handleSelectSkill.bind(
                                              this,
                                              skill.name,
                                          )}>
                                          {skill.name}
                                      </a>
                                  );
                              })
                            : ''}
                    </div>
                </div>
            </div>
        );
    }
}

SkillSelector.propTypes = {
    skills: PropTypes.array,
    suggested: PropTypes.array,
    showTitle: PropTypes.bool,
    showInstruction: PropTypes.bool,
    tagName: PropTypes.string,
    reset: PropTypes.bool,
};

SkillSelector.defaultProps = {
    skills: [],
    suggested: [],
    showTitle: true,
    showInstruction: false,
    tagName: 'tag',
    reset: false,
};

export default connect(SkillSelector);
