import React from 'react';

import BreadCrumb from '../containers/BreadCrumb';

export default class MultiTaskPay extends React.Component {
    render() {
        const {multi_task_payment} = this.props;
        return (
            <div>
                <BreadCrumb
                    section="Bulk Payment: Processing"
                    parents={[{link: '/payments', name: 'Payments'}]}
                />

                <div className="thank-you">
                    We are processing your payment. Thank you!<br />
                    <i className="fa fa-check-circle status-icon" />
                </div>
            </div>
        );
    }
}
