import React from 'react';
import {Dante, DanteEditor} from 'Dante2/lib/index.js';

import {Map, fromJS} from 'immutable';
import DanteImagePopover from 'Dante2/lib/components/popovers/image.js';
import DanteAnchorPopover from 'Dante2/lib/components/popovers/link.js';
import DanteInlineTooltip from 'Dante2/lib/components/popovers/addButton.js';
import DanteTooltip from './DanteTooltip';
import ImageBlock from 'Dante2/lib/components/blocks/image.js';
import EmbedBlock from 'Dante2/lib/components/blocks/embed.js';
import VideoBlock from 'Dante2/lib/components/blocks/video.js';
import PlaceholderBlock from 'Dante2/lib/components/blocks/placeholder.js';

import {resetBlockWithType, addNewBlockAt} from 'Dante2/lib/model/index.js';
import {ENDPOINT_OEMBED, ENDPOINT_UPLOAD} from '../constants/Api';

// create base element
var g = document.createElement('div');
g.setAttribute('id', 'app-dante');
document.body.appendChild(g);
g.style.marginTop = '150px';

// component implementation
export default class DanteWrapper extends React.Component {
    constructor(props) {
        super(props);
        let config = Map(fromJS(this.defaultOptions(props.config)));
        this.options = config.mergeDeep(props.config).toJS();
        console.log('options: ', this.options);
    }

    defaultOptions(options) {
        // default options
        if (options == null) {
            options = {};
        }
        let defaultOptions = {};
        const {content, read_only} = this.props;

        defaultOptions.el = 'app';
        defaultOptions.content = '';
        defaultOptions.read_only = false;
        defaultOptions.spellcheck = false;
        defaultOptions.title_placeholder = read_only ? '' : 'Title';
        defaultOptions.body_placeholder = read_only ? '' : 'Write your story';

        defaultOptions.widgets = [
            {
                title: 'add an image',
                icon: 'image',
                type: 'image',
                block: ImageBlock,
                editable: true,
                renderable: true,
                breakOnContinuous: true,
                wrapper_class: 'graf graf--figure',
                selected_class: 'is-selected is-mediaFocused',
                selectedFn: block => {
                    const {direction} = block.getData().toJS();
                    switch (direction) {
                        case 'left':
                            return 'graf--layoutOutsetLeft';
                        case 'center':
                            return '';
                        case 'wide':
                            return 'sectionLayout--fullWidth';
                        case 'fill':
                            return 'graf--layoutFillWidth';
                    }
                },
                handleEnterWithoutText(ctx, block) {
                    const {editorState} = ctx.state;
                    return ctx.onChange(
                        addNewBlockAt(editorState, block.getKey()),
                    );
                },
                handleEnterWithText(ctx, block) {
                    const {editorState} = ctx.state;
                    return ctx.onChange(
                        addNewBlockAt(editorState, block.getKey()),
                    );
                },
                widget_options: {
                    displayOnInlineTooltip: true,
                    insertion: 'upload',
                    insert_block: 'image',
                },
                options: {
                    upload_url: ENDPOINT_UPLOAD, //options.upload_url,
                    upload_headers: options.upload_headers,
                    upload_formName: options.upload_formName,
                    upload_callback: options.image_upload_callback,
                    image_delete_callback: options.image_delete_callback,
                    image_caption_placeholder:
                        options.image_caption_placeholder,
                },
            },
            {
                icon: 'embed',
                title: 'insert embed',
                type: 'embed',
                block: EmbedBlock,
                editable: true,
                renderable: true,
                breakOnContinuous: true,
                wrapper_class: 'graf graf--mixtapeEmbed',
                selected_class: 'is-selected is-mediaFocused',
                widget_options: {
                    displayOnInlineTooltip: true,
                    insertion: 'placeholder',
                    insert_block: 'embed',
                },
                options: {
                    endpoint: `${ENDPOINT_OEMBED}?url=`, //`//api.embed.ly/1/extract?key=${ options.api_key }&url=`,
                    placeholder:
                        'Paste a link to embed content from another site (e.g. Twitter) and press Enter',
                },
                handleEnterWithoutText(ctx, block) {
                    const {editorState} = ctx.state;
                    return ctx.onChange(
                        addNewBlockAt(editorState, block.getKey()),
                    );
                },
                handleEnterWithText(ctx, block) {
                    const {editorState} = ctx.state;
                    return ctx.onChange(
                        addNewBlockAt(editorState, block.getKey()),
                    );
                },
            },
            {
                icon: 'video',
                title: 'insert video',
                editable: true,
                type: 'video',
                block: VideoBlock,
                renderable: true,
                breakOnContinuous: true,
                wrapper_class: 'graf--figure graf--iframe',
                selected_class: ' is-selected is-mediaFocused',
                widget_options: {
                    displayOnInlineTooltip: true,
                    insertion: 'placeholder',
                    insert_block: 'video',
                },
                options: {
                    endpoint: `${ENDPOINT_OEMBED}?url=`, //`//api.embed.ly/1/oembed?key=${ options.api_key }&url=`,
                    placeholder:
                        'Paste a YouTube, Vine, Vimeo, or other video link, and press Enter',
                    caption: 'Type caption for embed (optional)',
                },

                handleEnterWithoutText(ctx, block) {
                    const {editorState} = ctx.state;
                    return ctx.onChange(
                        addNewBlockAt(editorState, block.getKey()),
                    );
                },

                handleEnterWithText(ctx, block) {
                    const {editorState} = ctx.state;
                    return ctx.onChange(
                        addNewBlockAt(editorState, block.getKey()),
                    );
                },
            },
            {
                renderable: true,
                editable: true,
                block: PlaceholderBlock,
                type: 'placeholder',
                wrapper_class: 'is-embedable',
                selected_class: ' is-selected is-mediaFocused',
                widget_options: {
                    displayOnInlineTooltip: false,
                },
                handleEnterWithText(ctx, block) {
                    const {editorState} = ctx.state;
                    const data = {
                        provisory_text: block.getText(),
                        endpoint: block.getData().get('endpoint'),
                        type: block.getData().get('type'),
                    };

                    return ctx.onChange(
                        resetBlockWithType(editorState, data.type, data),
                    );
                },
            },
        ];

        defaultOptions.tooltips = [
            {
                ref: 'insert_tooltip',
                component: DanteTooltip,
                displayOnSelection: true,
                selectionElements: [
                    'unstyled',
                    'blockquote',
                    'ordered-list',
                    'unordered-list',
                    'unordered-list-item',
                    'ordered-list-item',
                    'code-block',
                    'header-one',
                    'header-two',
                    'header-three',
                    'header-four',
                ],
                widget_options: {
                    block_types: [
                        // {label: 'p', style: 'unstyled'},
                        {label: 'h2', style: 'header-one', type: 'block'},
                        {label: 'h3', style: 'header-two', type: 'block'},
                        {label: 'h4', style: 'header-three', type: 'block'},
                        {
                            label: 'blockquote',
                            style: 'blockquote',
                            type: 'block',
                        },
                        {
                            label: 'insertunorderedlist',
                            style: 'unordered-list-item',
                            type: 'block',
                        },
                        {
                            label: 'insertorderedlist',
                            style: 'ordered-list-item',
                            type: 'block',
                        },
                        {label: 'code', style: 'code-block', type: 'block'},
                        {label: 'bold', style: 'BOLD', type: 'inline'},
                        {label: 'italic', style: 'ITALIC', type: 'inline'},
                    ],
                },
            },
            {
                ref: 'add_tooltip',
                component: DanteInlineTooltip,
            },
            {
                ref: 'anchor_popover',
                component: DanteAnchorPopover,
            },
            {
                ref: 'image_popover',
                component: DanteImagePopover,
            },
        ];

        defaultOptions.xhr = {
            before_handler: null,
            success_handler: null,
            error_handler: null,
        };

        const dw = this;

        defaultOptions.data_storage = {
            url: '/store',
            method: 'POST',
            success_handler: null,
            failure_handler: null,
            interval: 1500,
            save_handler: (editorContext, content) => {
                const {onChange} = this.props;
                if (onChange) {
                    onChange(editorContext, content);
                }
            },
        };

        defaultOptions.default_wrappers = [
            {className: 'graf--p', block: 'unstyled'},
            {className: 'graf--h2', block: 'header-one'},
            {className: 'graf--h3', block: 'header-two'},
            {className: 'graf--h4', block: 'header-three'},
            {className: 'graf--blockquote', block: 'blockquote'},
            {
                className: 'graf--insertunorderedlist',
                block: 'unordered-list-item',
            },
            {className: 'graf--insertorderedlist', block: 'ordered-list-item'},
            {className: 'graf--code', block: 'code-block'},
            {className: 'graf--bold', block: 'BOLD'},
            {className: 'graf--italic', block: 'ITALIC'},
        ];

        defaultOptions.continuousBlocks = [
            'unstyled',
            'blockquote',
            'ordered-list',
            'unordered-list',
            'unordered-list-item',
            'ordered-list-item',
            'code-block',
        ];

        defaultOptions.key_commands = {
            'alt-shift': [{key: 65, cmd: 'add-new-block'}],
            'alt-cmd': [
                {key: 49, cmd: 'toggle_block:header-one'},
                {key: 50, cmd: 'toggle_block:header-two'},
                {key: 53, cmd: 'toggle_block:blockquote'},
            ],
            cmd: [
                {key: 66, cmd: 'toggle_inline:BOLD'},
                {key: 73, cmd: 'toggle_inline:ITALIC'},
                {key: 75, cmd: 'insert:link'},
            ],
        };

        defaultOptions.character_convert_mapping = {
            '> ': 'blockquote',
            '*.': 'unordered-list-item',
            '* ': 'unordered-list-item',
            '- ': 'unordered-list-item',
            '1.': 'ordered-list-item',
            '# ': 'header-one',
            '##': 'header-two',
            '==': 'unstyled',
            '` ': 'code-block',
        };

        return defaultOptions;
    }

    render() {
        const {content, read_only} = this.props;
        return (
            <div id="dante-instance-wrapper">
                <DanteEditor
                    content={content}
                    config={{...this.options, read_only}}
                />
            </div>
        );
    }
}
