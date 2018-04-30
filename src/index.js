import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {BrowserRouter} from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';

// root component
import App from './components/App';

// global css
import './styles/index.css';

// routes
import routes from './routes';

// parse
import Parse from 'parse';
import parsecfg from './server/parsecfg';

Parse.initialize(parsecfg.APP_ID, parsecfg.MASTER_KEY);
Parse.serverURL = parsecfg.SERVER_URL;

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App routes={routes}/>
        </BrowserRouter>
    </Provider>, document.getElementById('root'));
registerServiceWorker();
