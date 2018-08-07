import React from 'react';

import TaskPay from './TaskPay';
import BreadCrumb from '../containers/BreadCrumb';

export default class MultiTaskPay extends React.Component {
    render() {
        return (
            <div>
                <BreadCrumb
                    section="Bulk Payment"
                    parents={[{link: '/payments', name: 'Payments'}]}
                />
                <TaskPay {...this.props} />
            </div>
        );
    }
}
