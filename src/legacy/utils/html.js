import _ from 'lodash';
import striptags from 'striptags';

export function nl_to_br(str) {
    if (str) {
        return str.replace(/\n/gi, '<br />');
    }
    return str;
}

export function br_to_nl(str) {
    if (str) {
        return str.replace(/<br\s*\/>/gi, '\n');
    }
    return str;
}

export function render_excerpt(excerpt) {
    return nl_to_br(excerpt);
}

export function objectToQueryString(obj) {
    var qs = _.reduce(
        obj,
        function(result, value, key) {
            return !_.isNull(value) && !_.isUndefined(value)
                ? (result += key + '=' + value + '&')
                : result;
        },
        '',
    ).slice(0, -1);
    return qs;
}

export function render_summary(body, length = 200) {
    return _.truncate(striptags((body || '').trim().replace('&nbsp;', '')), {
        length: length,
        separator: '',
    });
}

export function runOptimizely() {
    if (window.optimizely && window.optimizely.activeExperiments) {
        window.optimizely.activeExperiments.forEach(function(experimentID) {
            var variationID = window.optimizely.variationIdsMap[experimentID];
            if (variationID && Array.isArray(variationID)) {
                variationID = variationID[0];
            }

            var variation = window.optimizely.allVariations[variationID];
            if (variation) {
                eval(variation.code);
            }
        });
    }
}
