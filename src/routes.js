/**
 * Filename: routes.js
 * Author: Akshara Balachandra
 * Description: Define all routes for components here.
 * Date: 04/22/2018
 */

import React from 'react';
import { Route, Switch } from 'react-router';

// Module root components
import Homepage from './components/Homepage';
import { LoginPage } from './components/LoginPage';
import { RegistrationPage } from './components/RegistrationPage';
import { LogoutPage } from './components/LogoutPage';
import PageNotFound from './components/common/PageNotFound';

export default (
    <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/login" component={LoginPage}/>
        <Route exact path="/register" component={RegistrationPage}/>
        <Route exact path="/logout" component={LogoutPage} />
        <Route path="*" component={PageNotFound} />
    </Switch>
);
