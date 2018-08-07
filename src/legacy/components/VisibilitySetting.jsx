import React from 'react';

import {
    SETTINGS_VISIBILITY_CHOICES,
    VISIBILITY_DEVELOPERS,
} from '../constants/Api';

export default class VisibilitySetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visibility: VISIBILITY_DEVELOPERS};
    }

    componentDidMount() {
        const {visibility} = this.props;
        this.setState({visibility: visibility});
    }

    componentDidUpdate(prevProps, prevState) {
        const {name, visibility, onChange} = this.props;

        var can_publish = true;
        if (visibility != prevProps.visibility) {
            can_publish = false;
            this.setState({visibility: visibility});
        }

        if (
            can_publish &&
            this.state.visibility != prevState.visibility &&
            onChange
        ) {
            let setting = {};
            setting[name] = this.state.visibility;
            onChange(setting);
        }
    }

    onChange(visibility) {
        this.setState({visibility: visibility});
    }

    render() {
        return (
            <div
                className="btn-group btn-choices"
                role="group"
                aria-label="visibility">
                {SETTINGS_VISIBILITY_CHOICES.map(visibility => {
                    return (
                        <button
                            key={visibility.id}
                            type="button"
                            className={
                                'btn ' +
                                (this.state.visibility == visibility.id
                                    ? ' active'
                                    : '')
                            }
                            onClick={this.onChange.bind(this, visibility.id)}>
                            {visibility.name}
                        </button>
                    );
                })}
            </div>
        );
    }
}
