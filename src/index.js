import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";

import registerServiceWorker from "./registerServiceWorker";
import configureStore from "./store/configureStore";

// root component
import App from "./components/App";

// global css
import "./styles/index.css";
import "./styles/bootstrap.min.css";

// routes
import routes from "./routes";

/*import "bootstrap-material-design/dist/css/bootstrap-material-design.css";
import "bootstrap-material-design/dist/js/bootstrap-material-design.min.js";
import 'bootstrap-material-design/js/bootstrapMaterialDesign.js'*/

// parse
import Parse from "parse";
import parsecfg from "./server/parsecfg";

// history
import history from './history'

Parse.initialize(parsecfg.APP_ID, parsecfg.MASTER_KEY);
Parse.masterKey = parsecfg.MASTER_KEY;
Parse.serverURL = parsecfg.SERVER_URL;

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App routes={routes} />
        </Router>
    </Provider>,
    document.getElementById("root")
);
registerServiceWorker();
