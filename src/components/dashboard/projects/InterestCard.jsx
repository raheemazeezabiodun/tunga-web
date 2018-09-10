import PropTypes from 'prop-types';
import React from 'react';
import {Col, Row} from 'reactstrap';

import Avatar from '../../core/Avatar';
import IconButton from '../../core/IconButton';
import {STATUS_ACCEPTED, STATUS_INTERESTED, STATUS_REJECTED} from "../../../actions/utils/api";


export default class InterestCard extends React.Component {
    static propTypes = {
        project: PropTypes.object.isRequired,
        status: PropTypes.string,
        interest: PropTypes.object.isRequired,
        ProjectActions: PropTypes.func.isRequired
    };

    onUpdateApproval(status) {
        const { ProjectActions, interest } = this.props;
        ProjectActions.updateInterest(interest.id, {
            approval_status: status,
        })
    }

    render() {
        const { interest } = this.props;
        return (
            <Row>
                <Col md={5}>
                    <div className="interest-user">
                        <Avatar size='xs' image={interest.user.avatar_url} />
                        {interest.user.display_name}
                    </div>
                </Col>
                <Col md={7}>
                    {interest.status === STATUS_INTERESTED ? (
                        <div className="interest-actions">
                            <IconButton name='check'
                                size='main'
                                onClick={() => this.onUpdateApproval(STATUS_ACCEPTED)}
                                className={interest.approval_status === STATUS_ACCEPTED ? 'btn-accepted' : ''}
                            />
                            <IconButton name='times-circle'
                                size='main'
                                onClick={() => this.onUpdateApproval(STATUS_REJECTED)}
                                className={interest.approval_status === STATUS_REJECTED ? 'btn-rejected' : ''}
                            />
                        </div>
                    ): null}
                </Col>
            </Row>
        )
    }
}
