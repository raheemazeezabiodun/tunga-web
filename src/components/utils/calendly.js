export const CALENDLY_CALL_URL = 'https://calendly.com/tunga/hello/';

export function openCalendlyWidget(url = CALENDLY_CALL_URL) {
    if(Calendly) {
        Calendly.showPopupWidget(url);
    }
}
