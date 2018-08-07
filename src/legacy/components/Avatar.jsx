import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

export default class Avatar extends React.Component {
    render() {
        const {src, size, icon, badge, title, url} = this.props;
        const image = src;
        let avatar = (
            <div className="avatar-wrapper">
                {badge ? <span className="badge">{badge}</span> : null}
                <div
                    className={
                        'avatar ' +
                        (image ? '' : ' avatar-icon ') +
                        (size || '')
                    }
                    style={image ? {backgroundImage: `url(${image})`} : {}}>
                    {image ? null : (
                        <span
                            className={
                                'glyphicon ' + (icon || 'glyphicon-user')
                            }
                        />
                    )}
                </div>
            </div>
        );

        let linked_avatar = url ? <Link to={url}>{avatar}</Link> : avatar;

        return title ? (
            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip id="tooltip">
                        <strong>{title}</strong>
                    </Tooltip>
                }>
                {linked_avatar}
            </OverlayTrigger>
        ) : (
            linked_avatar
        );
    }
}

Avatar.propTypes = {
    src: PropTypes.string,
    size: PropTypes.string,
    icon: PropTypes.string,
    iconType: PropTypes.string,
    badge: PropTypes.number,
};
