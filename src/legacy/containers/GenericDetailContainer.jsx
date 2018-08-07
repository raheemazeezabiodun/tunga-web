import GenericContainer from './GenericContainer';

export default class GenericDetailContainer extends GenericContainer {
    componentDidMount() {
        this.getItem();
    }

    componentDidUpdate(prevProps) {
        const idKey = this.getIdKey();
        if (idKey && this.props[idKey] != prevProps[idKey]) {
            this.getItem();
        }
    }

    // Children must implement these 2 methods
    getIdKey() {
        return null;
    }

    getItem() {}
}
