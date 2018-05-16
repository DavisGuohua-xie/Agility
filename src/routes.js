/**
 * Filename: routes.js
 * Author: Akshara Balachandra
 * Description: Define all routes for components here.
 * Date: 04/22/2018
 */

import React from 'react';
import { Route, Switch } from 'react-router';

// Module root components
import {Homepage} from './components/Homepage';
import { LoginPage } from './components/LoginPage';
import { LogoutPage } from './components/LogoutPage';
import {SettingsPage} from './components/SettingsPage';
import {ChatPage} from './components/ChatPage';
import {ProjectOverviewPage} from './components/ProjectOverviewPage';
import PageNotFound from './components/common/PageNotFound';

export default (
    <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/login" component={LoginPage}/>
        <Route exact path="/register" component={RegistrationPage}/>
        <Route path="/chat" component={ChatPage}/>
        <Route exact path="/logout" component={LogoutPage} />
        <Route exact path="/myaccount" component={SettingsPage}/>
        <Route exact path="/overview" component={ProjectOverviewPage}/>
        <Route path="*" component={PageNotFound} />
    </Switch>
);
