import React from 'react';

import {
    SETTINGS_VISIBILITY_CHOICES,
    VISIBILITY_DEVELOPERS,
} from '../constants/Api';

export default class SwitchSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {status: false};
    }

    componentDidMount() {
        const {status} = this.props;
        this.setState({status: status});
    }

    componentDidUpdate(prevProps, prevState) {
        const {name, status, onChange} = this.props;

        var can_publish = true;
        if (status != prevProps.status) {
            can_publish = false;
            this.setState({status: status});
        }

        if (can_publish && this.state.status != prevState.status && onChange) {
            let setting = {};
            setting[name] = this.state.status;
            onChange(setting);
        }
    }

    onChange(status) {
        this.setState({status: status});
    }

    render() {
        const buttons = this.props.buttons || {on: 'on', off: 'off'};
        return (
            <div
                className="btn-group btn-choices btn-switch"
                role="group"
                aria-label="status">
                <button
                    type="button"
                    className={'btn ' + (this.state.status ? ' active' : '')}
                    onClick={this.onChange.bind(this, true)}>
                    {buttons.on || 'on'}
                </button>
                <button
                    type="button"
                    className={'btn ' + (this.state.status ? '' : ' active')}
                    onClick={this.onChange.bind(this, false)}>
                    {buttons.off || 'off'}
                </button>
            </div>
        );
    }
}
