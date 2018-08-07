export const MOUSE_EVENTS = [
    'onClick', 'onClickCapture', 'onContextMenu', 'onContextMenuCapture', 'onDoubleClick', 'onDoubleClickCapture',
    'onDrag', 'onDragCapture', 'onDragEnd', 'onDragEndCapture', 'onDragEnter', 'onDragEnterCapture',
    'onDragExit', 'onDragExitCapture', 'onDragLeave', 'onDragLeaveCapture', 'onDragOver', 'onDragOverCapture',
    'onDrop', 'onDropCapture', 'onMouseDown', 'onMouseDownCapture', 'onMouseEnter', 'onMouseLeave',
    'onMouseMove', 'onMouseMoveCapture', 'onMouseOut', 'onMouseOutCapture',
    'onMouseOver', 'onMouseOverCapture', 'onMouseUp', 'onMouseUpCapture'
];

export const FOCUS_EVENTS = [
    'onFocus', 'onFocusIn', 'onFocusOut', 'onFocusCapture', 'onBlur', 'onBlurCapture'
];

export const KEYBOARD_EVENTS = [
    'onKeyUp', 'onKeyUpCapture', 'onKeyDown', 'onKeyDownCapture', 'onKeyPress', 'onKeyPressCapture'
];

export const FORM_EVENTS = [
    'onChange', 'onChangeCapture', 'onInput', 'onInputCapture', 'onReset', 'onResetCapture', 'onSubmit', 'onSubmitCapture', 'onInvalid', 'onInvalidCapture'
];

export const BUTTON_EVENTS = [...MOUSE_EVENTS, ...FOCUS_EVENTS];
export const INPUT_EVENTS = [...MOUSE_EVENTS, ...FOCUS_EVENTS, ...KEYBOARD_EVENTS, ...FORM_EVENTS];

export function addEventListeners(events, props) {
    let eventHandlers = {};
    events.forEach(item => {
        if(props[item]) {
            eventHandlers[item] = props[item];
        }
    });
    return eventHandlers;
}

export function filterEventProps(props) {
    let eventProps = {};
    [...MOUSE_EVENTS, ...FOCUS_EVENTS, ...KEYBOARD_EVENTS, ...FORM_EVENTS].forEach(item => {
        if(props[item]) {
            eventProps[item] = props[item];
        }
    });
    return eventProps;
}
