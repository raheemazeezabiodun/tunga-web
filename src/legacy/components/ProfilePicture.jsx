import React from 'react';
import Dropzone from 'react-dropzone';
import Progress from './status/Progress';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import Avatar from './Avatar';

import {getUser} from '../utils/auth';

export default class ProfilePicture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {photo: null};
    }

    componentDidMount() {
        this.props.ProfileActions.retrieveProfile();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.Profile.isSaved.user &&
            !prevProps.Profile.isSaved.user
        ) {
            this.setState({photo: null});
        }
    }

    onClickOpen() {
        this.refs.dropzone.open();
    }

    onDrop(files) {
        this.setState({photo: files[0]});
    }

    handleSubmit = e => {
        e.preventDefault();

        const image = this.state.photo;
        const {ProfileActions} = this.props;

        ProfileActions.updateAuthUser({image});
        return;
    };

    render() {
        const {Profile} = this.props;
        let prof_pic = this.state.photo
            ? this.state.photo.preview
            : getUser().avatar_url;

        return (
            <div>
                {Profile.isRetrieving ? (
                    <Progress />
                ) : (
                    <form
                        onSubmit={this.handleSubmit}
                        name="profile"
                        role="form"
                        ref="profile_form">
                        <FormStatus
                            loading={Profile.isSaving.user}
                            success={Profile.isSaved.user}
                            message={'Profile picture saved'}
                            error={Profile.error.user}
                        />

                        {Profile.error.user ? (
                            <FieldError message="Uploaded file should be an image (png, jpg, jpeg or gif) and must be less than 2MB" />
                        ) : null}

                        <Dropzone
                            ref="dropzone"
                            className="dropzone"
                            multiple={false}
                            accept={'image/*'}
                            onDrop={this.onDrop.bind(this)}>
                            <div className="msg">
                                {prof_pic ? (
                                    <div>
                                        <Avatar src={prof_pic} size="xxl" />
                                        {this.state.photo ? (
                                            <p>{this.state.photo.name}</p>
                                        ) : null}
                                    </div>
                                ) : (
                                    <i
                                        className="fa fa-cloud-upload fa-2x"
                                        style={{marginTop: '30px'}}
                                    />
                                )}
                                <div>
                                    Drop an image here or click to select an
                                    image to upload.
                                </div>
                            </div>
                        </Dropzone>

                        <button
                            type="submit"
                            className="btn  pull-right"
                            disabled={
                                Profile.isSaving.user || !this.state.photo
                            }>
                            Upload
                        </button>
                        <div className="clearfix" />
                    </form>
                )}
            </div>
        );
    }
}
