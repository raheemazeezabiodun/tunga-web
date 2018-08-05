import PropTypes from "prop-types";
import React from "react";
import _ from "lodash";

import DocumentPicker from "../../core/DocumentPicker";
import Icon from "../../core/Icon";
import {
    DOC_TYPE_ESTIMATE, DOC_TYPE_OTHER, DOC_TYPE_PROPOSAL, DOC_TYPE_REQUIREMENTS,
    DOCUMENT_TYPES_MAP
} from "../../../actions/utils/api";

import {isAdminOrPMOrClient} from '../../utils/auth';

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
        const {project} = this.props;
        if (docs.length > this.state.documents[key].length) {
            let newDoc = docs[docs.length - 1];
            this.props.ProjectActions.createDocument({...newDoc, project: {id: project.id}});
        }

        let newState = {};
        newState[key] = docs;
        this.setState({documents: {...this.state.documents, ...newState}});
    }

    onRemoveDoc(idx) {
        this.props.ProjectActions.deleteDocument(idx);
    }

    render() {
        const {project} = this.props;
        const {documents} = project;

        return (
            <div className="project-docs">
                {[
                    DOC_TYPE_ESTIMATE, DOC_TYPE_PROPOSAL,
                    DOC_TYPE_REQUIREMENTS, DOC_TYPE_OTHER
                ].map(docType => {
                    return (
                        <div key={`doc-type-${docType}`} className="section">
                            <div className="font-weight-normal">
                                {(DOCUMENT_TYPES_MAP[docType] || _.upperFirst(docType)).replace(/\s?document/, '')} documents
                            </div>
                            <div className={`file-list ${isAdminOrPMOrClient() && !project.archived?'':'readonly'}`}>
                                {this.filterDocumentsByType(documents, docType).map(doc => {
                                    return (
                                        <div key={`doc-${doc.id}`}>
                                            <div className="file-item" key={doc.id}>
                                                <a href={doc.download_url} target="_blank">
                                                    <Icon name={doc.file?'download':'link'}/> {doc.title?`${doc.title} | `:''} {doc.download_url}
                                                </a>
                                                {isAdminOrPMOrClient() && !project.archived?(
                                                    <button
                                                        className="btn"
                                                        onClick={this.onRemoveDoc.bind(this, doc.id)}>
                                                        <Icon name="close" />
                                                    </button>
                                                ):null}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {isAdminOrPMOrClient() && !project.archived?(
                                <DocumentPicker showSelected={false}
                                                documentType={docType}
                                                size="main"
                                                onChange={docs => {this.onChangeDocs(docType, docs);}}/>
                            ):null}
                        </div>
                    );
                })}
            </div>
        );
    }
}
