import React from 'react';
import moment from 'moment';

export default class Clock extends React.Component {
    constructor(props) {
        super(props);
        const output = this.renderTime();
        this.state = {...output};
    }

    componentDidMount() {
        this.setInterval(this.tick.bind(this), 1000);
    }

    componentWillUnmount() {
        this.intervals.map(clearInterval);
    }

    setInterval() {
        this.intervals.push(setInterval.apply(null, arguments));
    }

    UNSAFE_componentWillMount() {
        this.intervals = [];
    }

    tick() {
        const output = this.renderTime();
        this.setState({...output});
    }

    renderTime() {
        const currentTime = new Date();
        let h = currentTime.getHours();
        let m = currentTime.getMinutes();
        let s = currentTime.getSeconds();

        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }

        const currentMoment = moment(currentTime);
        return {
            day: currentMoment.format('dddd Do, MMMM'),
            hours: currentMoment.format('HH'),
            minutes: currentMoment.format('mm'),
            seconds: currentMoment.format('ss'),
        };
    }

    render() {
        return (
            <div className="clock">
                <div className="time">
                    {this.state.hours}:{this.state.minutes}
                </div>
                <div className="day">{this.state.day}</div>
            </div>
        );
    }
}
