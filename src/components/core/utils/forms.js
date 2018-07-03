export function filterValidProps(allowedPropKeys, props) {
    let filteredProps = {};
    (allowedPropKeys || []).forEach(item => {
        if(props[item] || props[item] === '' || typeof props[item] === 'boolean') {
            filteredProps[item] = props[item];
        }
    });
    return filteredProps;
}

export function filterInputProps(props) {
    return filterValidProps(['value', 'defaultValue', 'required', 'disabled'], props);
}

export function filterButtonProps(props) {
    return filterValidProps(['disabled'], props);
}
