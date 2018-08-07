import {createConfirmation} from 'react-confirm';
import ConfirmDialog from '../components/ConfirmDialog';

const confirm = createConfirmation(ConfirmDialog);

export default function(confirmation, isPrompt = false, options = {}) {
    return confirm({confirmation, options: {...options, isPrompt}});
}
