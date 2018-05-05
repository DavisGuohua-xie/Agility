import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router';
import * as accountActions from '../actions/accountActions';

import NavBar from './common/Navbar';
import SettingsLayout from './settings/SettingsLayout';

class SettingsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSave(e) {
        e.preventDefault();

        console.log('saving...');
    }

    render() {
        return (
            <div>
                <NavBar/>
                <SettingsLayout/>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(accountActions, dispatch)
    };
}

function mapStateToProps(state, ownProps) {
    console.log(state);
    return {
        loading: state.ajaxCallsInProgress > 0
    }
}

const connectedHomepage = withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsPage));
export { connectedHomepage as SettingsPage };