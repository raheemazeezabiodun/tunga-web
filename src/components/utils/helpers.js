export function displayExpectedReturn(value) {
    let displayValue = 'permanent';
    switch(value) {
        case '2w':
            displayValue = '2 weeks';
            break;
        case '6m':
            displayValue = '6 months';
            break;
        default:
            break;
    }
    return displayValue;
}
