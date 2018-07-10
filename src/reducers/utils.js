export function getIds(items) {
    return Array.from(
        new Set(
            items.map(item => {
                return item.id;
            }),
        ),
    );
}

export function reduceUser(state, user, profile, company) {
    state = state || {};
    user = user || {};
    profile = {...state.profile, ...user.profile, ...profile};
    company = {...state.company, ...user.company, ...company};
    company.name = company.name || profile.company;
    return {...state, ...user, profile, company};
}
