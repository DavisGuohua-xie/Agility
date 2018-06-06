import React from "react";
import moment from "moment";
import BigCalendar from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

export const ProjectCalendar = props => {
    BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

    let events = [];

    props.events.forEach(boardEvents => {
        console.log(boardEvents);
        events.push(...boardEvents);
    });

    let newevents = events.map(event => {
        return { title: event.title, start: new Date(event.metadata.due_date), end: new Date(event.metadata.due_date)};
    });

    console.log(newevents);
    return (
        <BigCalendar
            events={newevents}
            startAccessor="start"
            endAccessor="end"
            defaultDate={new Date()}
            style={{ height: "calc(100% - 40px)" }}
        />
    );
};
