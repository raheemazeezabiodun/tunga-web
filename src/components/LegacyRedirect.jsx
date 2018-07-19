import React from 'react';
import BootLogo from "./core/BootLogo";

export default class LegacyRedirect extends React.Component {

    componentDidMount() {
        window.location.href = `/welcome?redirect_path=${window.location.pathname.replace('/welcome', '')}`;
    }

    render() {
        return (
            <BootLogo/>
        );
    }
}
