import React from 'react';
import PropTypes from "prop-types";

import IconButton from './IconButton';
import DocumentType from './DocumentType';
import DocumentForm from "./DocumentForm";

import {openModal} from './utils/modals';
import {addPropsToChildren} from './utils/children';
import Button from "./Button";
import Icon from "./Icon";
import {DOCUMENT_TYPES_MAP} from "../../actions/utils/api";

const ModalWrapper = (props) => {
    return (
        <div>
            {addPropsToChildren(props.children, {onChange: props.proceed, onSave: props.proceed})}
        </div>
    );
};

export default class DocumentPicker extends React.Component {

    static defaultProps = {
        variant: 'icon',
        showSelected: true

    };

    static propTypes = {
        variant: PropTypes.string,
        className: PropTypes.string,
        onChange: PropTypes.func,
        documentType: PropTypes.string,
        documentTypes: PropTypes.array,
        showSelected: PropTypes.bool,
        size: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            documents: [],
        };
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if(this.props.onChange && !_.isEqual(prevState.documents, this.state.documents)) {
            this.props.onChange(this.state.documents);
        }
    }

    onSelectType = () => {
        openModal(
            <ModalWrapper>
                <DocumentType/>
            </ModalWrapper>,
            'Type of document',
            true, {className: 'modal-upload'}
         ).then((type) => {
             this.onSelectDocument(type);
         });
    };

    onSelectDocument(type) {
        let self = this;
        openModal(
            <ModalWrapper>
                <DocumentForm type={type} documentType={this.props.documentType} documentTypes={this.props.documentTypes}/>
            </ModalWrapper>,
            `Add ${this.props.documentType?(DOCUMENT_TYPES_MAP[this.props.documentType] || `${this.props.documentType} document`):' document'}`,
            true, {className: 'modal-upload'}
        ).then((document) => {
            self.setState({documents: [...this.state.documents, document]});
        });
    }

    onRemoveDoc(idx) {
        this.setState({documents: [...this.state.documents.slice(0, idx), ...this.state.documents.slice(idx+1)]});
    }

    render() {
        return (
            <div className="document-input">
                {this.props.showSelected && this.state.documents.length > 0?(
                    <div className="file-list">
                        {this.state.documents.map((doc, index) => {
                            return (
                                <div className="file-item" key={index}>
                                    <i className="tg-ic-file"/> {doc.title} {doc.file?doc.file.name:doc.url}
                                    <button className="btn" onClick={this.onRemoveDoc.bind(this, index)}><i className="tg-ic-close"/></button>
                                </div>
                            )
                        })}
                    </div>
                ):null}

                {this.props.variant === 'button'?(
                    <Button onClick={this.onSelectType}><Icon name="upload" size={this.props.size}/> Add documents</Button>
                ):(
                    <IconButton name="add" size={this.props.size} onClick={this.onSelectType}/>
                )}
            </div>
        );
    }
}
