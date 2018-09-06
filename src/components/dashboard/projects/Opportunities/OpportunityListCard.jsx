import PropTypes from 'prop-types';
import React from 'react';
import {Col, Row} from 'reactstrap';

import Avatar from '../../../core/Avatar';
import IconButton from '../../../core/IconButton';


export default class ProjectList extends React.Component {
    static propTypes = {
        project: PropTypes.object.isRequired,
        status: PropTypes.string,
        interest: PropTypes.object.isRequired,
        ProjectActions: PropTypes.func.isRequired
    };

    handleInterestUpdate(status) {
        const { ProjectActions, project, interest } = this.props;
        ProjectActions.updateInterest(interest.id, {
            approval_status: status,
            user: {
                id: interest.user.id
            },
            project: {
                id: project.id
            }
        })
    }

    render() {
        const { interest } = this.props;
        return (
            <Row>
                <Col className="interest-poll-card" md={8}>
                    <div className="interest-poll-card-details">
                        <Avatar size='xs' image={interest.user.avatar_url} />
                        <p>{interest.user.display_name}</p>
                    </div>
                </Col>
                {this.props.status === 'interested' ? (
                    <Col md={4}>
                        <IconButton name='check'
                            size='main' 
                            onClick={() => this.handleInterestUpdate('accepted')}
                            className={interest.approval_status === 'accepted' ? 'opportunity-approval-icon-spacing opportunity-approval-accepted' : 'opportunity-approval-icon-spacing opportunity-approval-initial'}
                        />
                        <IconButton name='close'
                            size='main'
                            onClick={() => this.handleInterestUpdate('rejected')}
                            className={interest.approval_status === 'rejected' ? '' : 'opportunity-approval-initial'}
                        />
                    </Col>
                ): null}
            </Row>
        )
    }
}
