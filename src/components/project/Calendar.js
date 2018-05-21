import React from 'react';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export const ProjectCalendar = props => {
    BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
    return (
        <BigCalendar
            events={props.events}
            startAccessor='startDate'
            endAccessor='endDate'
            defaultDate={new Date()}
            style={{height: 'calc(100% - 40px)'}}
        />
    );
};