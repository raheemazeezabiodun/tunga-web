import * as Cookies from "js-cookie";

export function setLastChatAutoOpenAt(date) {
    Cookies.set('chatAutoOpenAt', date, { expires: 31 });
}

export function getLastChatAutoOpenAt() {
    let updatedchatAutoOpenAt = Cookies.get('chatAutoOpenAt');
    if(Cookies.get('tunga_chat_auto_open_at')) {
        if(!updatedchatAutoOpenAt) {
            updatedchatAutoOpenAt = Cookies.get('tunga_chat_auto_open_at');
            setLastChatAutoOpenAt(updatedchatAutoOpenAt);
        }
        Cookies.remove('tunga_chat_auto_open_at');
    }
    return updatedchatAutoOpenAt;
}

export function setChatStep(step) {
    Cookies.set('chatStep', step, { expires: 365 });
}

export function getChatStep() {
    return Cookies.get('chatStep');
}
