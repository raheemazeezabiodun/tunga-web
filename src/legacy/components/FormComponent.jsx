import React from 'react';
import {clearValidations} from '../actions/UtilityActions';
import store from '../store';

export default class FormComponent extends React.Component {
    componentWillUnmount() {
        store.dispatch(clearValidations());
    }

    onInputChange(key, e) {
        var new_state = {};
        new_state[key] = e.target.value;
        this.setState(new_state);
    }
}
