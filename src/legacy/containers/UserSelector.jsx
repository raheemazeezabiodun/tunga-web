import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import randomstring from 'randomstring';
import connect from '../utils/connectors/UserSelectionConnector';
import Avatar from '../components/Avatar';

const KEY_DOWN = 38;
const KEY_UP = 40;

class UserSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {user_name: '', selection_key: randomstring.generate()};
        this.handleGetSuggestions = _.debounce(this.handleGetSuggestions, 250);
    }

    componentDidMount() {
        const {UserSelectionActions, selected, deselected} = this.props;
        UserSelectionActions.invalidateUserSuggestions();
        UserSelectionActions.clearUserSelections(this.state.selection_key);

        if (selected && Array.isArray(selected)) {
            selected.forEach(user => {
                UserSelectionActions.addUserSelection(
                    user,
                    this.state.selection_key,
                );
            });
        }

        if (deselected && Array.isArray(deselected)) {
            deselected.forEach(id => {
                UserSelectionActions.removeUserSelection(
                    id,
                    this.state.selection_key,
                );
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            UserSelection,
            UserSelectionActions,
            onChange,
            selected,
            deselected,
            returnObjects,
        } = this.props;
        const selections =
            UserSelection.selected.ids[this.state.selection_key] || [];

        var can_publish = true;
        if (
            selected &&
            Array.isArray(selected) &&
            (!Array.isArray(prevProps.selected) ||
                selected.length != prevProps.selected.length)
        ) {
            can_publish = false;
            selected.forEach(user => {
                UserSelectionActions.addUserSelection(
                    user,
                    this.state.selection_key,
                );
            });
        }

        if (
            deselected &&
            Array.isArray(deselected) &&
            (!Array.isArray(prevProps.deselected) ||
                deselected.length != prevProps.deselected.length)
        ) {
            can_publish = false;
            deselected.forEach(id => {
                UserSelectionActions.removeUserSelection(
                    id,
                    this.state.selection_key,
                );
            });
        }

        if (
            can_publish &&
            prevProps.UserSelection.selected.ids[this.state.selection_key] !=
                selections &&
            onChange
        ) {
            const selection_objects_map =
                UserSelection.selected.users[this.state.selection_key] || {};
            const selection_objects = Object.keys(selection_objects_map).map(
                key => {
                    return selection_objects_map[key];
                },
            );
            onChange(returnObjects ? selection_objects : selections);
        }
    }

    onInputKeyUp(event) {
        // Implement keyboard navigation
        switch (event.which) {
            case KEY_UP:
                break;
            case KEY_DOWN:
                break;
        }
    }

    onQueryChange(e) {
        const {UserSelectionActions, filter} = this.props;
        var user_name = e.target.value;

        if (user_name == this.state.user_name) {
            return;
        }

        this.setState({user_name: user_name});
        if (!user_name) {
            UserSelectionActions.invalidateUserSuggestions(
                this.state.selection_key,
            );
            return;
        }

        this.handleGetSuggestions();
    }

    onUserRemove(user) {
        const {UserSelectionActions} = this.props;
        UserSelectionActions.removeUserSelection(
            user.id,
            this.state.selection_key,
        );
    }

    onUserSelect(user) {
        const {UserSelectionActions} = this.props;
        UserSelectionActions.addUserSelection(user, this.state.selection_key);
        UserSelectionActions.invalidateUserSuggestions(
            this.state.selection_key,
        );
        this.setState({user_name: ''});
    }

    handleComponentClick(e) {
        e.stopPropagation();
    }

    handleGetSuggestions() {
        const {UserSelectionActions, filter} = this.props;
        UserSelectionActions.getUserSuggestions(
            {search: this.state.user_name, ...filter},
            this.state.selection_key,
        );
    }

    render() {
        const {UserSelection, max, canRemove, unremovable} = this.props;
        const selections =
            UserSelection.selected.ids[this.state.selection_key] || [];
        const selection_users =
            UserSelection.selected.users[this.state.selection_key] || {};
        const suggestions =
            UserSelection.suggestions[this.state.selection_key] || [];

        return (
            <div className="user-selector tag-selector">
                <div className="tag-input">
                    {max && selections.length >= max ? null : (
                        <div
                            className="input-group col-lg-12"
                            onClick={this.handleComponentClick.bind(this)}>
                            <span className="input-group-addon">
                                <span className="glyphicon glyphicon-user" />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                ref="user_name"
                                value={this.state.user_name}
                                placeholder="Type a name or username to get suggestions"
                                onChange={this.onQueryChange.bind(this)}
                                onKeyUp={this.onInputKeyUp.bind(this)}
                            />
                        </div>
                    )}

                    <div className="list-group suggestions">
                        {UserSelection.isValid
                            ? suggestions.map(user => {
                                  return (
                                      <a
                                          key={user.id}
                                          className="list-group-item"
                                          onClick={this.onUserSelect.bind(
                                              this,
                                              user,
                                          )}>
                                          <div className="media">
                                              <div className="media-left">
                                                  <Avatar
                                                      src={user.avatar_url}
                                                      size="small"
                                                  />
                                              </div>
                                              <div className="media-body">
                                                  <div>{user.display_name}</div>
                                                  <div className="secondary">
                                                      @{user.username}
                                                  </div>
                                              </div>
                                          </div>
                                      </a>
                                  );
                              })
                            : null}
                    </div>
                </div>

                <div className="selections">
                    {selections.map(id => {
                        var user = selection_users[id];
                        return (
                            <div
                                key={id}
                                className="list-group-item selected-item">
                                <Avatar src={user.avatar_url} size="xs" />
                                {user.display_name} @{user.username}
                                {canRemove &&
                                (!unremovable ||
                                    unremovable.indexOf(user.id) == -1) ? (
                                    <a
                                        onClick={this.onUserRemove.bind(
                                            this,
                                            user,
                                        )}
                                        className="close">
                                        <i className="fa fa-remove" />
                                    </a>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

UserSelector.propTypes = {
    onChange: PropTypes.func.isRequired,
    max: PropTypes.number,
    selected: PropTypes.array,
    canRemove: PropTypes.bool,
    deselected: PropTypes.array,
    unremovable: PropTypes.array,
    returnObjects: PropTypes.bool,
};

UserSelector.defaultProps = {
    canRemove: true,
    returnObjects: false,
};

export default connect(UserSelector);
