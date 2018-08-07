import React from 'react';
import Dropzone from 'react-dropzone';
import Progress from './status/Progress';
import FormStatus from './status/FormStatus';

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
            this.props.Profile.isSaved.profile &&
            !prevProps.Profile.isSaved.profile
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

        const id_document = this.state.photo;
        const {Profile, ProfileActions} = this.props;

        ProfileActions.updateProfile(Profile.profile.id, {id_document});
        return;
    };

    render() {
        const {Profile} = this.props;
        let id_doc = this.state.photo
            ? this.state.photo.preview
            : Profile.profile.id_document;

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
                            loading={Profile.isSaving.profile}
                            success={Profile.isSaved.profile}
                            message={'ID document saved'}
                            error={Profile.error.profile}
                        />

                        <label>
                            Upload a scan of your National ID, Passport or
                            Driver's license *
                        </label>

                        <p className="alert alert-info">
                            This must be a PNG or JPG/JPEG file not exceeding
                            5MB
                        </p>

                        <Dropzone
                            ref="dropzone"
                            className="dropzone"
                            multiple={false}
                            accept={'image/*'}
                            onDrop={this.onDrop.bind(this)}>
                            <div className="msg">
                                {id_doc ? (
                                    <div>
                                        <img
                                            src={id_doc}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '300px',
                                            }}
                                        />
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
                            className="btn pull-right"
                            disabled={
                                Profile.isSaving.profile || !this.state.photo
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
