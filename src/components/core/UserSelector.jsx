import PropTypes from 'prop-types';
import React from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import randomstring from 'randomstring';
import _ from 'lodash';

import CustomInputGroup from "./CustomInputGroup";
import Icon from './Icon';
import Avatar from './Avatar';

import { filterEventProps } from "./utils/events";
import {filterInputProps} from "./utils/forms";

import * as UserActions  from "../../actions/UserActions";

const VARIANT_BOTTOM = 'bottom';

class UserSelector extends React.Component {
    static defaultProps = {
        placeholder: 'Type a name or username here',
        selectionKey: null,
        max: null,
    };

    static propTypes = {
        variant: PropTypes.string,
        className: PropTypes.string,
        selected: PropTypes.array,
        onChange: PropTypes.func,
        size: PropTypes.string,
        placeholder: PropTypes.string,
        selectionKey: PropTypes.string,
        account_type: PropTypes.string,
        max: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            selected: props.selected || props.value || [],
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

    getUsers(filter) {
        const {UserActions} = this.props;
        UserActions.listUsers(filter, this.state.selectionKey, this.state.prevKey);
    }

    onChange(e) {
        let username = e.target.value;
        this.getUsers({search: username, account_type: this.props.account_type});
        this.setState({search: username, showSuggestions: !!username});
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(!_.isEqual(nextProps.selected, this.props.selected)) {
            this.setState({selected: nextProps.selected});
        }
    }

    onSelectUser(user, e) {
        e.preventDefault();
        this.setState({search: '', showSuggestions: false, selected: Array.from(new Set([...this.state.selected, user]))});
    }

    onRemoveUser(user, e) {
        e.preventDefault();
        let idx = this.state.selected.map(user => {
            return user.id
        }).indexOf(user.id);
        if (idx > -1) {
            this.setState({selected: Array.from(new Set([...this.state.selected.slice(0, idx), ...this.state.selected.slice(idx + 1)]))});
        }
    }

    renderSelection(itemClass) {
        if(this.state.selected && this.state.selected.length) {
            return (
                <div className="selected">
                    {this.state.selected.map(user => {
                        return (
                            <div key={`user-${user.id}`}
                                 className={`selected-item ${itemClass || ''}`}>
                                <Avatar image={user.avatar_url} size="xs"/>
                                {user.display_name}
                                <a onClick={this.onRemoveUser.bind(this, user)}
                                   className="close">
                                    <Icon name="close" />
                                </a>
                            </div>
                        );
                    })}
                </div>
            );
        }
        return null;
    }

    render() {
        const {max} = this.props;

        return (
            <div className="tag-input">
                {this.props.variant !== VARIANT_BOTTOM?this.renderSelection():null}
                {!max || max > this.state.selected.length?(
                    <div>
                        <CustomInputGroup className={this.props.className}
                                          variant="personal" size={this.props.size}
                                          placeholder={this.props.placeholder}
                                          {...filterInputProps(this.props)}
                                          {...filterEventProps(this.props)}
                                          selected={this.state.selected}
                                          value={this.state.search}
                                          onFocus={() => {this.setState({showSuggestions: !!this.state.search})}}
                                          onChange={this.onChange.bind(this)}/>

                        {this.state.showSuggestions?(
                            <div className="list-group suggestions">
                                {(this.props.User.ids[this.state.selectionKey] || []).map(id => {
                                    let user = this.props.User.users[id] || {};
                                    if(this.state.selected.indexOf(id) > -1) {
                                        return null;
                                    }
                                    return (
                                        <a className="list-group-item"
                                           key={`user-${user.id}`}
                                           onClick={this.onSelectUser.bind(this, user)}>
                                            {user.display_name}
                                        </a>
                                    );
                                })}
                            </div>
                        ):null}
                    </div>
                ):null}
                {this.props.variant === VARIANT_BOTTOM?this.renderSelection('dark-user-block'):null}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        User: state.User,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        UserActions: bindActionCreators(UserActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSelector);
