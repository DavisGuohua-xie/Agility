import React from 'react';
import {Link} from 'react-router-dom';
import {Button} from 'reactstrap';

export const OverviewSubnav = props => {
    const overviewActive = props.active === 0 ? 'active nav-link' : 'nav-link';
    const tasklistActive = props.active === 1 ? 'active nav-link' : 'nav-link';

    return (
        <ul className="nav nav-tabs" style={{height: '40px'}}>
            <Button style={{margin: '2px'}} onClick={props.toggleSidebar} hidden={props.docked ? true : null}>
                Members <i className="fas fa-users"></i>
            </Button>
            <li className="nav-item" onClick={props.onTabChange}>
                <Link className={overviewActive} to={`/${props.projID}/overview`} data-tab="0">Overview</Link>
            </li>
            <li className="nav-item" onClick={props.onTabChange}>
                <Link className={tasklistActive} to={`/${props.projID}/tasks`} data-tab="1">Tasks</Link>
            </li>
        </ul>
    );
}