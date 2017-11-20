import React from 'react';
import {Link} from 'react-router-dom';
import Avatar from './Avatar';

import MessageForm from './MessageForm';
import ActivityList from './ActivityList';
import SupportChannelMiniForm from '../components/SupportChannelMiniForm';

import {getChannelKey} from '../utils/reducers';
import {isAuthenticated} from '../utils/auth';
import {CHANNEL_TYPES} from '../constants/Api';

export default class ChatBox extends React.Component {
  getView() {
    if (this.props.channelView) {
      return this.props.channelView;
    }
    return null;
  }

  onSendMessage(body, attachments) {
    const {channel, MessageActions} = this.props;
    MessageActions.createMessage({channel: channel.id, body}, attachments);
  }

  onUpload(files) {
    const {channel, ChannelActions} = this.props;
    ChannelActions.updateChannel(channel.id, null, files);
  }

  render() {
    const {channel, Auth, Channel, ChannelActions, Message} = this.props;
    const {attachments} = channel;
    let view = this.getView();
    var activities =
      Channel.detail.activity.items[getChannelKey(channel.id)] || [];
    if (channel.type == CHANNEL_TYPES.support) {
      activities = [
        {
          action: 'send',
          activity_type: 'message',
          activity: {
            sender: {
              id: 'tunga',
              username: null,
              short_name: 'Elijah',
              display_name: 'Elijah',
              avatar_url: require('../images/chat/elijah.jpg'),
            },
            body: 'Hi, feel free to ask me anything.',
          },
        },
        ...activities,
      ];

      if (activities.length >= 2 && !isAuthenticated()) {
        let emailForm = {
          action: 'send',
          activity_type: 'message',
          activity: {
            sender: {
              id: 'tunga',
              username: null,
              short_name: 'Tunga',
              display_name: 'Tunga',
              avatar_url: 'https://tunga.io/icons/Tunga_squarex150.png',
              hide: true,
            },
            isForm: true,
            body: (
              <div>
                {Channel.detail.channel.object_id
                  ? <div className="text-center got-it">
                      <div>We got it! Thanks</div>
                      <i className="icon tunga-icon-check" />
                    </div>
                  : <div>
                      <div>Where can we reach you to follow up?</div>
                      <SupportChannelMiniForm {...this.props} />
                    </div>}
              </div>
            ),
          },
        };
        activities = [
          ...activities.slice(0, 2),
          emailForm,
          ...activities.slice(2),
        ];
      }
    }

    return (
      <div className="list-box">
        {view == 'files'
          ? <div className="attachment-list">
              {attachments
                ? <div>
                    <h4>Files</h4>
                    {attachments.map(upload => {
                      return (
                        <div key={upload.id} className="file">
                          <a href={upload.url}>
                            <i className="fa fa-download" /> {upload.name}{' '}
                            <strong>[{upload.display_size}]</strong>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                : null}
            </div>
          : null}

        {view == 'people'
          ? <div className="people-list">
              <h4>People</h4>
              {channel.details && channel.details.participants
                ? <div className="row">
                    {channel.details.participants.map(user => {
                      return (
                        <div key={user.id} className="col-md-6">
                          <div className="media card">
                            <div className="media-left">
                              <Avatar src={user.avatar_url} size="" />
                            </div>
                            <div className="media-body">
                              <div>
                                <Link to={`/people/${user.username}`}>
                                  {user.display_name}
                                </Link>
                              </div>
                              <div className="secondary">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                : null}
            </div>
          : null}

        {['files', 'people'].indexOf(view) == -1
          ? [
              <ActivityList
                key="list"
                Auth={Auth}
                activities={activities}
                isLoading={
                  Channel.detail.activity.isFetching[
                    getChannelKey(channel.id)
                  ] || false
                }
                isLoadingMore={
                  Channel.detail.activity.isFetchingMore[
                    getChannelKey(channel.id)
                  ] || false
                }
                loadMoreUrl={
                  Channel.detail.activity.next[getChannelKey(channel.id)] ||
                  null
                }
                loadMoreCallback={ChannelActions.listMoreChannelActivity}
                loadMoreText="Show older messages"
                last_read={channel.previous_last_read || channel.last_read}
              />,
              <MessageForm
                key="msg_form"
                messageCallback={this.onSendMessage.bind(this)}
                messageSaved={Message.detail.isSaved}
                uploadCallback={this.onUpload.bind(this)}
                uploadSaved={Channel.detail.isSaved}
                isSending={Message.detail.isSaving || Channel.detail.isSaving}
                canUpload={isAuthenticated()}
              />,
            ]
          : null}
      </div>
    );
  }
}
