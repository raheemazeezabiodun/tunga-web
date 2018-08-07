import {createConfirmation} from 'react-confirm';
import GenericModal from '../GenericModal';

const confirm = createConfirmation(GenericModal);

export function openGenericModal(modalContent, options = {}) {
    return confirm({modalContent, options: {...options}});
}

function safeClassNameOptions(className, options) {
    let safeOptions = options || {};
    if(safeOptions.className) {
        safeOptions.className = `${className} ${safeOptions.className}`;
    } else {
        safeOptions.className = className;
    }
    return safeOptions;
}

export function openAlert(body, title=null, canClose=false, options =null) {
    return openGenericModal(body, {hideCancel: true, mustRespond: !canClose, ...safeClassNameOptions('modal-alert', options)});
}

export function openConfirm(body, title=null, canClose=false, options =null) {
    return openGenericModal(body, {mustRespond: !canClose, title, ...safeClassNameOptions('modal-confirm', options)});
}

export function openPrompt(body, title=null, canClose=false, options =null) {
    return openGenericModal(body, {isPrompt: true, mustRespond: !canClose, title, ...safeClassNameOptions('modal-prompt', options)});
}

export function openModal(body, title=null, canClose=true, options =null) {
    return openGenericModal(body, {hideActions:true, mustRespond: !canClose, title, ...(options || {})});
}
