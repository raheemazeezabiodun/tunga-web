import React from 'react';
import {Link} from 'react-router';

import SearchBox from '../components/SearchBox';
import Progress from '../components/status/Progress';
import LoadMore from '../components/status/LoadMore';
import Avatar from '../components/Avatar';
import ChannelInfo from '../components/ChannelInfo';
import UserSearchForm from '../components/UserSearchForm';
import connect from '../utils/connectors/ChannelConnector';

import {CHANNEL_TYPES} from '../constants/Api';
import {isAuthenticated, isAdmin} from '../utils/auth';

export function resizeOverviewBox() {
    var w_h = $(window).height();
    var nav_h = $('nav.navbar').height();
    var wf_h = $('.chat-head').height();
    var t_h = nav_h + wf_h + 90;

    if (w_h > t_h) {
        $('.chat-overview').css('height', w_h - t_h + 'px');
    }
}

class MessagePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowing: false,
        };
    }

    componentDidMount() {
        resizeOverviewBox();
        $(window).resize(resizeOverviewBox);

        this.getChannels();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.route.path != prevProps.route.path) {
            this.getChannels();
        }
    }

    getChannelTypeFilter() {
        switch (this.props.route.path) {
            case 'help':
                return CHANNEL_TYPES.support;
            default:
                return null;
        }
    }

    getChannels() {
        const {ChannelActions} = this.props;
        if (isAuthenticated()) {
            ChannelActions.listChannels({type: this.getChannelTypeFilter()});
        }
    }

    toggleButton() {
        this.setState((prevState, props) => {
            return {
                isShowing: !this.state.isShowing,
            };
        });
    }

    renderChildren() {
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    Channel: this.props.Channel,
                    Message: this.props.Message,
                    ChannelActions: this.props.ChannelActions,
                    MessageActions: this.props.MessageActions,
                });
            }.bind(this),
        );
    }

    render() {
        const {Channel, ChannelActions} = this.props;
        const channel_type_filter = this.getChannelTypeFilter();

        return (
            <div id="chat-window">
                <div className="col-lg-12 nopadding">
                    <div className="col-md-6 col-sm-6 col-xs-6  nopadding">
                        {isAuthenticated() ? (
                            <div className="chat-head">
                                <h2>
                                    {channel_type_filter ==
                                    CHANNEL_TYPES.support
                                        ? 'Help'
                                        : 'Messages'}
                                </h2>
                            </div>
                        ) : null}
                    </div>

                    <div className="col-md-6 col-sm-6 col-xs-6 nopadding">
                        <div className={this.state.isShowing ? '' : 'hidden'}>
                            <UserSearchForm
                                {...this.props}
                                toggleButton={() => this.toggleButton()}
                            />
                        </div>

                        {this.state.isShowing ? null : channel_type_filter ==
                        CHANNEL_TYPES.support ? null : (
                            <div className="pull-right btn-start">
                                <a onClick={() => this.toggleButton()}>
                                    <i className="fa fa-plus" />{' '}
                                    {channel_type_filter ==
                                    CHANNEL_TYPES.support
                                        ? 'Create a new inquiry'
                                        : 'Start a new conversation'}
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="col-xs-12 nopadding">
                        <hr style={{marginTop: 0}} />
                    </div>
                </div>
                <div className="col-xs-12 nopadding">
                    <div className="chat-overview overview">
                        {isAuthenticated() &&
                        (isAdmin() ||
                            channel_type_filter != CHANNEL_TYPES.support) ? (
                            <div className="sidebox channelbox">
                                <SearchBox
                                    placeholder="Search"
                                    onSearch={ChannelActions.listChannels}
                                    count={Channel.list.count}
                                    custom_class="search-box-group-custom"
                                />
                                {Channel.list.isFetching ? (
                                    <Progress />
                                ) : (
                                    <div className="list-box">
                                        <div className="channel-list">
                                            {Channel.list.ids.map(id => {
                                                let channel =
                                                    Channel.list.channels[id];
                                                return (
                                                    <Link
                                                        key={id}
                                                        to={`${
                                                            channel_type_filter ==
                                                            CHANNEL_TYPES.support
                                                                ? '/help'
                                                                : '/conversation'
                                                        }/${channel.id}/`}
                                                        className="media"
                                                        activeClassName="active">
                                                        <div className="media-left">
                                                            <Avatar
                                                                src={
                                                                    channel.user
                                                                        ? channel
                                                                              .user
                                                                              .avatar_url
                                                                        : null
                                                                }
                                                                icon={
                                                                    channel.user
                                                                        ? null
                                                                        : 'glypichon-comment'
                                                                }
                                                                badge={
                                                                    channel.new ||
                                                                    null
                                                                }
                                                            />
                                                        </div>
                                                        <div className="media-body channel-details">
                                                            <ChannelInfo
                                                                channel={
                                                                    channel
                                                                }
                                                            />
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                        <LoadMore
                                            url={Channel.list.next}
                                            callback={
                                                ChannelActions.listMoreChannels
                                            }
                                            loading={
                                                Channel.list.isFetchingMore
                                            }
                                            text="more"
                                        />
                                    </div>
                                )}
                            </div>
                        ) : null}
                        <div className="mainbox">{this.renderChildren()}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(MessagePage);
