import React from 'react';
import {Link} from 'react-router-dom';

export const OverviewSubnav = props => {
    const overviewActive = props.active === 0 ? 'active nav-link' : 'nav-link';
    const tasklistActive = props.active === 1 ? 'active nav-link' : 'nav-link';

    return (
        <ul className="nav nav-tabs nav-fill" style={{height: '40px'}}>
            <li className="nav-item" onClick={props.onTabChange} data-tab={0}>
                <Link className={overviewActive} to="/overview">Overview</Link>
            </li>
            <li className="nav-item" data-tab={1}>
                <Link className={tasklistActive} to="/tasklist">Tasks</Link>
            </li>
        </ul>
    );
}