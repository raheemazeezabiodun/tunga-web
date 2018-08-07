import React from 'react';
import {Modal} from 'react-bootstrap';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as NavActions from '../actions/NavActions';

class LargeModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showModal: false, title: null};
    }

    componentDidMount() {
        this.toggle(this.props.show);
        this.setState({title: this.props.title});
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.show != this.props.show) {
            this.toggle(this.props.show);
        }

        if (prevProps.title != this.props.title) {
            this.setState({title: this.props.title});
        }
    }

    close() {
        this.setState({showModal: false});
        if (this.props.onHide) {
            this.props.onHide();
        }

        const {NavActions} = this.props;
        NavActions.reportPathChange(null, null);
    }

    open() {
        this.setState({showModal: true});
    }

    toggle(open = false) {
        if (open) {
            this.open();
        } else {
            this.close();
        }
    }

    render() {
        const {modalSize, bsStyle, className} = this.props;
        return (
            <Modal
                show={this.state.showModal}
                onHide={this.close.bind(this)}
                bsSize={modalSize}
                bsStyle={bsStyle}
                dialogClassName={className}>
                <Modal.Header closeButton>
                    {this.state.title ? (
                        <Modal.Title>{this.state.title}</Modal.Title>
                    ) : null}
                </Modal.Header>
                <Modal.Body>{this.props.children}</Modal.Body>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        NavActions: bindActionCreators(NavActions, dispatch),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(LargeModal);
