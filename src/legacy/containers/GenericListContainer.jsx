import PropTypes from 'prop-types';
import randomstring from 'randomstring';
import _ from 'lodash';

import GenericContainer from './GenericContainer';

export default class GenericListContainer extends GenericContainer {
    constructor(props) {
        super(props);
        this.state = {
            selection_key: props.selectionKey || randomstring.generate(),
            prev_key: null,
        };
    }

    componentDidMount() {
        this.getList(this.props.filters);
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.selectionKey &&
            this.props.selectionKey != prevProps.selectionKey
        ) {
            this.setState({
                selection_key: this.props.selectionKey,
                prev_key: prevProps.selectionKey,
            });
        }

        if (
            !_.isEqual(this.props.filters, prevProps.filters) ||
            this.state.selection_key != prevState.selection_key
        ) {
            this.getList(this.props.filters);
        }
    }

    // Children must implement this method
    getList(filters) {}
}

GenericListContainer.propTypes = {
    filters: PropTypes.object,
    selectionKey: PropTypes.string,
};

GenericListContainer.defaultProps = {
    filters: {},
    selectionKey: null,
};
