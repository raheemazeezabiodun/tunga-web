export function filterValidProps(allowedPropKeys, props) {
    let filteredProps = {};
    (allowedPropKeys || []).forEach(item => {
        if(props[item] || props[item] === '' || typeof props[item] === 'boolean') {
            filteredProps[item] = props[item] || '';
        }
    });
    return filteredProps;
}

export function filterInputProps(props) {
    return filterValidProps(['name', 'value', 'defaultValue', 'required', 'disabled', 'autoComplete', 'step', 'pattern'], props);
}

export function filterButtonProps(props) {
    return filterValidProps(['disabled'], props);
}
