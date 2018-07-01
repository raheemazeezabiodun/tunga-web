import PropTypes from "prop-types";
import React from "react";
import { Container, Row, Col } from "reactstrap";

import DocumentPicker from "../core/DocumentPicker";
import { DOCUMENT_TYPES } from "../../actions/utils/api";

export default class Docs extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        ProjectActions: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.documents = {
            estimate: [],
            proposal: [],
            requirements: [],
            other: []
        };
    }

    onChangeValue(key, value) {
        let new_doc;

        if (value.length > this.documents[key].length) {
            new_doc = value[value.length - 1];
            this.props.ProjectActions.createDocument(new_doc);
        }

        this.documents[key] = [...value];
    }

    filterDocumentsByType(docs, type) {
        let filtered_docs = [];
        let len = docs.length;

        for (var i = 0; i < len; i++) {
            if (docs[i].type === type) {
                filtered_docs.push(docs[i]);
            }
        }

        return filtered_docs;
    }

    renderfilteredDocs(type) {
        let filtered_docs = this.filterDocumentsByType(
            this.props.project.documents,
            type
        );
        let list = [];

        if (filtered_docs.length > 0) {
            list = filtered_docs.map(doc => {
                return (
                    <div className="file-item" key={doc.id}>
                        <a href={doc.download_url}>
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
            });

            return <div className="file-list">{list}</div>;
        }

        return <div className="file-list" />;
    }

    onRemoveDoc(idx) {
        this.props.ProjectActions.deleteDocument(idx);
    }

    render() {
        return (
            <div>
                <br />
                <Container>
                    <Row className="documents-row-bottom-margin">
                        <Col>
                            <div className="font-weight-medium">
                                {" "}
                                Estimates document{" "}
                            </div>
                            {this.renderfilteredDocs("estimate")}
                            <DocumentPicker
                                showSelected={false}
                                documentType="estimate"
                                onChange={docs => {
                                    this.onChangeValue("estimate", docs);
                                }}
                            />
                        </Col>
                    </Row>
                    <Row className="documents-row-bottom-margin">
                        <Col>
                            <div className="font-weight-medium">
                                {" "}
                                Proposal documents{" "}
                            </div>
                            {this.renderfilteredDocs("proposal")}
                            <DocumentPicker
                                showSelected={false}
                                documentType="proposal"
                                onChange={docs => {
                                    this.onChangeValue("proposal", docs);
                                }}
                            />
                        </Col>
                    </Row>
                    <Row className="documents-row-bottom-margin">
                        <Col>
                            <div className="font-weight-medium">
                                {" "}
                                Requirements documents{" "}
                            </div>
                            {this.renderfilteredDocs("requirements")}
                            <DocumentPicker
                                showSelected={false}
                                documentType="requirements"
                                onChange={docs => {
                                    this.onChangeValue("requirements", docs);
                                }}
                            />
                        </Col>
                    </Row>
                    <Row className="documents-row-bottom-margin">
                        <Col>
                            <div className="font-weight-medium">
                                {" "}
                                Other documents{" "}
                            </div>
                            {this.renderfilteredDocs("other")}
                            <DocumentPicker
                                showSelected={false}
                                documentType="other"
                                onChange={docs => {
                                    this.onChangeValue("other", docs);
                                }}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
