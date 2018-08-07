export const SEARCH_START = 'SEARCH_START';

export function searchStart(query) {
    return {
        type: SEARCH_START,
        query,
    };
}
