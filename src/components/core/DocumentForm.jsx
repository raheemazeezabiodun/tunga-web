import React from 'react';
import PropTypes from "prop-types";
import {FormGroup} from 'reactstrap';

import Upload from "./Upload";
import Select from "./Select";
import Input from "./Input";
import CustomInputGroup from "./CustomInputGroup";
import TextArea from "./TextArea";
import Button from "./Button";
import FieldError from "./FieldError";

import {DOCUMENT_TYPES} from "../../actions/utils/api";

export default class DocumentForm extends React.Component {
    static defaultProps = {
        type: 'file',
    };

    static propTypes = {
        type: PropTypes.string,
        documentType: PropTypes.string,
        documentTypes: PropTypes.array,
        onChange: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            document: {
                title: '',
                description: '',
                type: props.documentType || null,
                file: null,
                url: '',
            },
            errors: {}
        };
    }

    onChange(key, value) {
        let newState = {};
        newState[key] = value;
        this.setState({document: {...this.state.document, ...newState}});
    }

    onSave = (e) => {
        e.preventDefault();

        if(this.state.document.file || this.state.document.url) {
            const {onSave} = this.props;
            if(onSave) {
                onSave(this.state.document);
            }
            this.setState({errors: {}})
        } else {
            this.setState({
                errors: {file: 'Select a file', url: 'Add a url'}
            })
        }
    };

    render() {
        const {type, documentTypes} = this.props;

        return (
            <form onSubmit={this.onSave}>
                {this.props.documentType?null:(
                    <FormGroup>
                        <Select options={Array.isArray(documentTypes) && documentTypes.length > 0?documentTypes:DOCUMENT_TYPES} onChange={(type) => {this.onChange('type', type)}} required/>
                    </FormGroup>
                )}
                <FormGroup>
                    <Input placeholder="Insert title here"
                           onChange={(e) => {this.onChange('title', e.target.value)}}/>
                </FormGroup>
                {type === 'url'?(
                    <FormGroup>
                        {this.state.errors.url?(
                            <FieldError message={this.state.errors.url}/>
                        ):null}
                        <CustomInputGroup variant="url"
                                          onChange={(e) => {this.onChange('url', e.target.value)}} required/>
                    </FormGroup>
                ):(
                    <FormGroup>
                        {this.state.errors.file?(
                            <FieldError message={this.state.errors.file}/>
                        ):null}
                        <Upload onChange={(files) => {this.onChange('file', files[0])}}/>
                    </FormGroup>
                )}
                <FormGroup>
                    <TextArea placeholder="Description"
                              onChange={(e) => {this.onChange('description', e.target.value)}}/>
                </FormGroup>
                <FormGroup>
                    <Button type="submit" className="float-right">Save</Button>
                </FormGroup>
            </form>
        );
    }
}

