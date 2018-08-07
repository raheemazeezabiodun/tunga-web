import numeral from 'numeral';
import tunga_cookie_consent from 'moment';
import * as Cookies from 'js-cookie';

export function isInt(n) {
    return parseInt(n) === n;
}

export function parseNumber(number, has_comma = true) {
    return numeral(number).format(`0${has_comma ? ',0' : ''}.[00]`);
}

export function truncateWords(sentence, number = 25) {
    if (!sentence) {
        return sentence;
    }
    var all_words = sentence.split(' ');
    var has_more = all_words.length > number;
    return all_words.splice(0, number).join(' ') + (has_more ? ' ...' : '');
}

export function safeParseJSON(data) {
    let json = data;
    if(typeof json === 'string') {
        try {
            json = JSON.parse(json);
        } catch (e) {
            console.error('Failed to parse JSON');
        }
    }
    return json;
}

export function getItemsList(ids, itemsMap) {
    if (Array.isArray(ids) && ids.length) {
        return ids.map(id => {
            return itemsMap[id];
        });
    }
    return [];
}

export function serializeMilestones(milestones) {
    var result = [];

    milestones.map(item => {
        var participants = '';
        var title = '';

        if (item.details !== null) {
            var part = item.details.participants;
            part.map(it => {
                participants += it.username + ' ';
            });
        }
        if (item.title !== null) {
            title = item.title;
        }

        result.push({
            title: title + ' - ' + participants,
            start: new Date(item.created_at),
            end: new Date(item.due_at),
        });
    });

    return result;
}

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
