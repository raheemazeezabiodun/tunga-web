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
    [
        ['name', 'company'],
        ['bio', 'company_bio'],
        ['website', 'website'],
        ['vat_number', 'vat_number'],
        ['reg_no', 'company_reg_no'],
        ['ref_no', 'reference_number'],
        ['skills', 'skills'],
        ['country', 'country'],
        ['city', 'city'],
        ['street', 'street'],
        ['plot_number', 'plot_number'],
        ['postal_code', 'postal_code'],
        ['postal_address', 'postal_address'],
        ['tel_number', 'phone_number']
    ].forEach(item => {
        let companyField = item[0],
            profileField = item[1];
        company[companyField] = company[companyField] || profile[profileField];
    });
    return {...state, ...user, profile, company};
}
