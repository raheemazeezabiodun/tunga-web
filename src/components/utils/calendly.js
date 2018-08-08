import {GA_EVENT_ACTIONS, GA_EVENT_CATEGORIES, sendGAEvent} from "../../actions/utils/tracking";

export const CALENDLY_CALL_URL = 'https://calendly.com/tunga/hello/';

export function openCalendlyWidget(url = CALENDLY_CALL_URL) {
    if(Calendly) {
        Calendly.showPopupWidget(url);
        sendGAEvent(GA_EVENT_CATEGORIES.CONTACT, GA_EVENT_ACTIONS.SCHEDULE_CALL);
    }
}
