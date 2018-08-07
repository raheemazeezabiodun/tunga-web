import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import randomstring from 'randomstring';

import Icon from './Icon';
import IconButton from "./IconButton";
import OverlayTooltip from "./OverlayTooltip";

export default class Avatar extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        image: PropTypes.string,
        icon: PropTypes.string,
        size: PropTypes.string,
        title: PropTypes.string,
        link: PropTypes.string,
        badge: PropTypes.number,
        verified: PropTypes.bool,
        remove: PropTypes.bool,
        onRemove: PropTypes.func
    };

    static defaultProps = {
        verified: false,
        remove: false
    };

    onRemove = () => {
        const {onRemove} = this.props;
        if(onRemove) {
            onRemove();
        }
    };

    render() {
        const {className, image, icon, size, title, link, badge, verified, remove} = this.props,
            avatarId = `avatar${randomstring.generate()}`;
        let avatar = (
            <div className={`avatar ${size?`avatar-${size}`:''} ${image?'':'avatar-icon'}`}
                 style={image?{backgroundImage: `url(${image})`}:{}}>
                {image ? null : (
                    icon || <Icon name="avatar"/>
                )}
            </div>
        );

        let linkifiedAvatar = link?(<Link to={link}>{avatar}</Link>):avatar;

        return (
            <div id={avatarId} className={`avatar-wrapper ${className || ''}`}>
                {badge?(
                    <span className="badge">{badge}</span>
                ):null}
                {verified?(
                    <Icon name="check" className="verified"/>
                ):null}
                {remove?(
                    <IconButton name="close"
                                size="sm"
                                className="remove"
                                onClick={this.onRemove}/>
                ):null}
                {title?(
                    <OverlayTooltip placement="top" overlay={title}>
                        {linkifiedAvatar}
                    </OverlayTooltip>
                ):linkifiedAvatar}
            </div>
        );
    }
}
