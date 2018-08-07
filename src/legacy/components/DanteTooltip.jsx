import React from 'react';
import ReactDOM from 'react-dom';

import {
    convertToRaw,
    CompositeDecorator,
    getVisibleSelectionRect,
    getDefaultKeyBinding,
    getSelectionOffsetKeyForNode,
    KeyBindingUtil,
    ContentState,
    Editor,
    EditorState,
    Entity,
    RichUtils,
} from 'draft-js';

import {getSelectionRect, getSelection} from 'Dante2/lib/utils/selection.js';

import {getCurrentBlock} from 'Dante2/lib/model/index.js';

class DanteTooltip extends React.Component {
    constructor(props) {
        super(props);
        this.getVisibleSelectionRect = getVisibleSelectionRect;
        this.state = {
            link_mode: false,
            show: false,
            position: {},
        };
    }

    getDefaultValue = () => {
        if (this.refs.dante_menu_input) {
            this.refs.dante_menu_input.value = '';
        }

        let currentBlock = getCurrentBlock(this.props.editorState);
        let blockType = currentBlock.getType();
        let selection = this.props.editor.state.editorState.getSelection();
        let contentState = this.props.editorState.getCurrentContent();
        let selectedEntity = null;
        let defaultUrl = null;
        return currentBlock.findEntityRanges(
            character => {
                let entityKey = character.getEntity();
                selectedEntity = entityKey;
                return (
                    entityKey !== null &&
                    contentState.getEntity(entityKey).getType() === 'LINK'
                );
            },
            (start, end) => {
                let selStart = selection.getAnchorOffset();
                let selEnd = selection.getFocusOffset();
                if (selection.getIsBackward()) {
                    selStart = selection.getFocusOffset();
                    selEnd = selection.getAnchorOffset();
                }

                if (start === selStart && end === selEnd) {
                    defaultUrl = contentState
                        .getEntity(selectedEntity)
                        .getData().url;
                    return (this.refs.dante_menu_input.value = defaultUrl);
                }
            },
        );
    };

    getPosition() {
        let pos = this.state.position;
        return pos;
    }

    setPosition(coords) {
        return this.setState({
            position: coords,
        });
    }

    _clickBlockHandler = (ev, style) => {
        ev.preventDefault();

        this.props.onChange(
            RichUtils.toggleBlockType(this.props.editorState, style),
        );

        return setTimeout(() => {
            return this.relocate();
        }, 0);
    };

    _clickInlineHandler = (ev, style) => {
        ev.preventDefault();

        this.props.onChange(
            RichUtils.toggleInlineStyle(this.props.editorState, style),
        );

        return setTimeout(() => {
            return this.relocate();
        }, 0);
    };

    _disableLinkMode = ev => {
        ev.preventDefault();
        return this.setState({
            link_mode: false,
            url: '',
        });
    };

    _enableLinkMode = ev => {
        ev.preventDefault();
        return this.setState({
            link_mode: true,
        });
    };

    blockItems = () => {
        return this.props.widget_options.block_types.filter(o => {
            return o.type === 'block';
        });
    };

    confirmLink = e => {
        e.preventDefault();
        let {editorState} = this.props;
        let urlValue = e.currentTarget.value;
        let contentState = editorState.getCurrentContent();
        let selection = editorState.getSelection();

        let opts = {
            url: urlValue,
            showPopLinkOver: this.props.showPopLinkOver,
            hidePopLinkOver: this.props.hidePopLinkOver,
        };

        let entityKey = Entity.create('LINK', 'MUTABLE', opts);
        //contentState.createEntity('LINK', 'MUTABLE', opts)

        if (selection.isCollapsed()) {
            console.log('COLLAPSED SKIPPING LINK');
            return;
        }

        this.props.onChange(
            RichUtils.toggleLink(editorState, selection, entityKey),
        );

        return this._disableLinkMode(e);
    };

    display = b => {
        if (b) {
            return this.show();
        } else {
            return this.hide();
        }
    };

    displayActiveMenu = () => {
        if (this.state.show) {
            return 'dante-menu--active';
        } else {
            return '';
        }
    };

    displayLinkMode = () => {
        if (this.state.link_mode) {
            return 'dante-menu--linkmode';
        } else {
            return '';
        }
    };

    handleInputEnter = e => {
        if (e.which === 13) {
            return this.confirmLink(e);
        }
    };

    hide = () => {
        return this.setState({
            link_mode: false,
            show: false,
        });
    };

    hideMenu() {
        return this.hide();
    }

    inlineItems = () => {
        return this.props.widget_options.block_types.filter(o => {
            return o.type === 'inline';
        });
    };

    isDescendant(parent, child) {
        let node = child.parentNode;
        while (node !== null) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    relocate = () => {
        let currentBlock = getCurrentBlock(this.props.editorState);
        let blockType = currentBlock.getType();
        // display tooltip only for unstyled

        if (this.props.configTooltip.selectionElements.indexOf(blockType) < 0) {
            this.hide();
            return;
        }

        if (this.state.link_mode) {
            return;
        }
        if (!this.state.show) {
            return;
        }

        let el = this.refs.dante_menu;
        let padd = el.offsetWidth / 2;

        let nativeSelection = getSelection(window);
        if (!nativeSelection.rangeCount) {
            return;
        }

        let selectionBoundary = getSelectionRect(nativeSelection);

        let parent = ReactDOM.findDOMNode(this.props.editor);
        let parentBoundary = parent.getBoundingClientRect();

        // hide if selected node is not in editor
        if (!this.isDescendant(parent, nativeSelection.anchorNode)) {
            this.hide();
            return;
        }

        let danteOffset = 370;
        try {
            danteOffset = $('#dante-instance-wrapper').offset().top - 137;
        } catch (e) {
            // failed to find dynamic offset
        }

        let top =
            selectionBoundary.top + danteOffset - parentBoundary.top - -90 - 5;
        let left = selectionBoundary.left + selectionBoundary.width / 2 - padd;

        if (!top || !left) {
            return;
        }

        console.log('dante offset:', danteOffset);

        console.log('tooltip top: ', top, el);

        // console.log "SET SHOW FOR TOOLTIP INSERT MENU"
        return this.setState({
            show: true,
            position: {
                left,
                top,
            },
        });
    };

    show = () => {
        return this.setState({
            show: true,
        });
    };

    render = () => {
        return (
            <div
                id="dante-menu"
                ref="dante_menu"
                className={`dante-menu ${this.displayActiveMenu()} ${this.displayLinkMode()}`}
                style={this.getPosition()}>
                <div className="dante-menu-linkinput">
                    <input
                        className="dante-menu-input"
                        ref="dante_menu_input"
                        placeholder={this.props.widget_options.placeholder}
                        onKeyPress={this.handleInputEnter}
                        defaultValue={this.getDefaultValue()}
                    />
                    <div
                        className="dante-menu-button"
                        onMouseDown={this._disableLinkMode}
                    />
                </div>
                <ul className="dante-menu-buttons">
                    {this.blockItems().map((item, i) => {
                        return (
                            <DanteTooltipItem
                                key={i}
                                item={item}
                                handleClick={this._clickBlockHandler}
                                editorState={this.props.editorState}
                                type="block"
                                currentStyle={
                                    this.props.editorState.getCurrentInlineStyle
                                }
                            />
                        );
                    })}

                    <DanteTooltipLink
                        editorState={this.props.editorState}
                        enableLinkMode={this._enableLinkMode}
                    />

                    {this.inlineItems().map((item, i) => {
                        return (
                            <DanteTooltipItem
                                key={i}
                                item={item}
                                type="inline"
                                editorState={this.props.editorState}
                                handleClick={this._clickInlineHandler}
                            />
                        );
                    })}
                </ul>
            </div>
        );
    };
}

class DanteTooltipItem extends React.Component {
    activeClass = () => {
        if (this.isActive()) {
            return 'active';
        } else {
            return '';
        }
    };

    activeClassBlock = () => {
        //console.log "EDITOR STATE", @props.editorState
        if (!this.props.editorState) {
            return;
        }
        let selection = this.props.editorState.getSelection();
        let blockType = this.props.editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey())
            .getType();
        return this.props.item.style === blockType;
    };

    activeClassInline = () => {
        if (!this.props.editorState) {
            return;
        }
        //console.log @props.item
        return this.props.editorState
            .getCurrentInlineStyle()
            .has(this.props.item.style);
    };

    handleClick = ev => {
        return this.props.handleClick(ev, this.props.item.style);
    };

    isActive = () => {
        if (this.props.type === 'block') {
            return this.activeClassBlock();
        } else {
            return this.activeClassInline();
        }
    };

    render = () => {
        return (
            <li
                className={`dante-menu-button ${this.activeClass()}`}
                onMouseDown={this.handleClick}>
                <i
                    className={`dante-icon dante-icon-${this.props.item.label}`}
                    data-action="bold"
                />
            </li>
        );
    };
}

class DanteTooltipLink extends React.Component {
    promptForLink = ev => {
        let selection = this.props.editorState.getSelection();
        if (!selection.isCollapsed()) {
            return this.props.enableLinkMode(ev);
        }
    };

    render = () => {
        return (
            <li className="dante-menu-button" onMouseDown={this.promptForLink}>
                <i
                    className="dante-icon icon-createlink"
                    data-action="createlink">
                    link
                </i>
            </li>
        );
    };
}

export default DanteTooltip;
