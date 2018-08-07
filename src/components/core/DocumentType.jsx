import React from 'react';
import PropTypes from "prop-types";

import ChoiceGroup from "./ChoiceGroup";

export default class DocumentType extends React.Component {
    static propTypes = {
        onChange: PropTypes.func,
    };

    onChange = (type) => {
        const {onChange} = this.props;
        if(onChange) {
            onChange(type);
        }
    };

    render() {
        let choices = [
            ['file', 'Upload file', 'upload'],
            ['url', 'Insert url', 'link']
        ];

        return (
            <div className="text-center">
                <ChoiceGroup variant="card" choices={choices} onChange={this.onChange}/>
            </div>
        );
    }
}

