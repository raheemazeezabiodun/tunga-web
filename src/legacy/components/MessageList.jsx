import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import Linkify from './Linkify';

import Progress from './status/Progress';
import LoadMore from './status/LoadMore';
import Avatar from './Avatar';
import Attachments from './Attachments';

import {getUser} from '../utils/auth';

export default class MessageList extends React.Component {
    componentDidMount() {
        const {MessageActions, filters, search, channel} = this.props;
        MessageActions.listMessages({...filters, search});

        if (channel) {
            this.setInterval(this.getNewMessages.bind(this), 5000);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.search != this.props.search) {
            const {MessageActions, filters, search} = this.props;
            MessageActions.listMessages({...filters, search});
        }
    }

    componentWillUnmount() {
        this.intervals.map(clearInterval);
    }

    getNewMessages() {
        const {Message, MessageActions, search, filters, channel} = this.props;
        if (
            channel &&
            !Message.list.isFetching &&
            Message.list.messages.length
        ) {
            var since = 0;
            if (Message.list.messages.length) {
                since =
                    Message.list.messages[Message.list.messages.length - 1].id;
            }
            MessageActions.listMessages({
                ...filters,
                search,
                channel: channel.id,
                since,
            });
        }
    }

    setInterval() {
        this.intervals.push(setInterval.apply(null, arguments));
    }

    UNSAFE_componentWillMount() {
        this.intervals = [];
    }

    renderThread(thread) {
        const {Message, channel} = this.props;
        if (thread.first) {
            let message = thread.first;
            let day_format = 'd/MM/YYYY';
            var last_sent_day = '';
            let today = moment
                .utc()
                .local()
                .format(day_format);

            if (!message.user) {
                message.user = {};
            }

            return (
                <div
                    key={message.id}
                    id={'message' + message.id}
                    className={
                        'message' +
                        (channel &&
                        message.user.id != getUser().id &&
                        Message.list.last_read < message.id
                            ? ' new'
                            : '')
                    }>
                    <div className="media-left">
                        <Avatar src={message.user.avatar_url} />
                    </div>
                    <div className="media-body">
                        <div className="body">
                            <p>
                                <Link
                                    to={
                                        channel
                                            ? `/people/${
                                                  message.user.username
                                              }/`
                                            : `/conversation/${
                                                  message.channel
                                              }/#message${message.id}`
                                    }>
                                    {message.user.short_name}
                                </Link>
                                <TimeAgo
                                    date={moment
                                        .utc(message.created_at)
                                        .local()
                                        .format()}
                                    className="pull-right"
                                />
                            </p>
                            <div>
                                <Linkify properties={{target: '_blank'}}>
                                    {message.body}
                                </Linkify>
                            </div>
                            {message.attachments.length ? (
                                <Attachments
                                    attachments={message.attachments}
                                />
                            ) : null}
                        </div>

                        {thread.others
                            ? thread.others.map(other_msg => {
                                  let sent_day = moment
                                      .utc(other_msg.created_at)
                                      .local()
                                      .format(day_format);
                                  let msg = (
                                      <div className="sub-message">
                                          {sent_day == last_sent_day ||
                                          sent_day != today ? null : (
                                              <p>
                                                  <TimeAgo
                                                      date={moment
                                                          .utc(
                                                              other_msg.created_at,
                                                          )
                                                          .local()
                                                          .format()}
                                                      className="pull-right"
                                                  />
                                              </p>
                                          )}
                                          <div>
                                              <Linkify
                                                  properties={{
                                                      target: '_blank',
                                                  }}>
                                                  {other_msg.body}
                                              </Linkify>
                                          </div>
                                          {other_msg.attachments.length ? (
                                              <Attachments
                                                  attachments={
                                                      other_msg.attachments
                                                  }
                                              />
                                          ) : null}
                                      </div>
                                  );

                                  last_sent_day = sent_day;
                                  return msg;
                              })
                            : null}
                    </div>
                </div>
            );
        }
        return null;
    }

    render() {
        const {Message, MessageActions, channel} = this.props;
        var last_sender = null;
        var last_channel = null;
        var thread = {};

        return (
            <div className="message-list">
                {Message.list.isFetching ? (
                    <Progress />
                ) : (
                    <div>
                        {Message.list.messages.map((message, idx, all_msgs) => {
                            var msgs = [];
                            if (
                                message.user.id == last_sender &&
                                message.channel == last_channel
                            ) {
                                thread.others = [...thread.others, message];
                            } else {
                                msgs = [...msgs, this.renderThread(thread)];
                                thread.first = message;
                                thread.others = [];
                            }
                            if (idx + 1 == all_msgs.length) {
                                msgs = [...msgs, this.renderThread(thread)];
                            }
                            last_sender = message.user.id;
                            last_channel = message.channel;
                            return msgs;
                        })}

                        {Message.list.messages.length ? (
                            ''
                        ) : (
                            <div className="alert alert-info">No messages</div>
                        )}

                        <LoadMore
                            url={Message.list.next}
                            callback={MessageActions.listMoreMessages}
                            loading={Message.list.isFetchingMore}
                            direction="down"
                            text="Show older messages"
                        />
                    </div>
                )}
            </div>
        );
    }
}
