import PropTypes from "prop-types";
import React from "react";
import _ from "lodash";

import DocumentPicker from "../core/DocumentPicker";
import {
    DOC_TYPE_ESTIMATE, DOC_TYPE_OTHER, DOC_TYPE_PROPOSAL, DOC_TYPE_REQUIREMENTS,
    DOCUMENT_TYPES_MAP
} from "../../actions/utils/api";

export default class Docs extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        ProjectActions: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state  = {
            documents: {
                estimate: [],
                proposal: [],
                requirements: [],
                other: []
            }
        };
    }

    filterDocumentsByType(docs, type) {
        let filteredDocs = [];

        docs.forEach(doc => {
            if (doc.type === type) {
                filteredDocs.push(doc);
            }
        });
        return filteredDocs;
    }

    onChangeDocs(key, docs) {
        if (docs.length > this.state.documents[key].length) {
            let newDoc = docs[docs.length - 1];
            this.props.ProjectActions.createDocument(newDoc);
        }

        let newState = {};
        newState[key] = docs;
        this.setState({documents: {...this.state.documents, ...newState}});
    }

    onRemoveDoc(idx) {
        this.props.ProjectActions.deleteDocument(idx);
    }

    render() {
        const {project: {documents}} = this.props;

        return (
            <div>
                {[
                    DOC_TYPE_ESTIMATE, DOC_TYPE_PROPOSAL,
                    DOC_TYPE_REQUIREMENTS, DOC_TYPE_OTHER
                ].map(docType => {
                    return (
                        <div>
                            <div className="font-weight-medium">
                                {(DOCUMENT_TYPES_MAP[docType] || _.upperFirst(docType)).replace(/\s?document/, '')} documents
                            </div>
                            <div className="file-list">
                                {this.filterDocumentsByType(documents, docType).map(doc => {
                                    return (
                                        <div className="file-item" key={doc.id}>
                                            <a href={doc.download_url} target="_blank">
                                                <i
                                                    className={
                                                        doc.file ? "tg-ic-download" : "tg-ic-link"
                                                    }
                                                />{" "}
                                                {doc.file ? doc.title : doc.url}
                                            </a>
                                            <button
                                                className="btn"
                                                onClick={this.onRemoveDoc.bind(this, doc.id)}
                                            >
                                                <i className="tg-ic-close" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            <DocumentPicker
                                showSelected={false}
                                documentType={docType}
                                onChange={docs => {
                                    this.onChangeDocs(docType, docs);
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        );
    }
}
