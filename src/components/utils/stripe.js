export function parseStripeAmount(amount) {
    return parseInt(
        (Math.round(amount) * 100).toString()
    );
}

export function parsePaymentObject(invoice, token) {
    return {
        token: token.token,
        amount: token.amount,
        email: token.email,
        description: invoice.title,
        currency: token.currency,
        invoice_id: invoice.id,
        project_id: invoice.project.id,
        payment_method: 'stripe',
    };
}
