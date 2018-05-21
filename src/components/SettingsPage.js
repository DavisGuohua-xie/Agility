import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router';
import * as accountActions from '../actions/accountActions';

import {NavBar} from './common/Navbar';
import SettingsLayout from './settings/SettingsLayout';
import Parse from 'parse';

class SettingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // TODO: set initial user info here from redux store (props)
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);

        var currentUser = Parse.User.current();
        if (!currentUser) {
            this.props.history.push("/login");
        }
    }

    handleSave(e) {
        e.preventDefault();
        // TODO: save logic here
        console.log('saving...');
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <div>
                <NavBar history={this.props.history}/>
                <SettingsLayout
                    onChange={this.handleChange}
                    onSave={this.handleSave}
                    />
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
        // TODO: map user info from state into this component's props
    }
}

const connectedHomepage = withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsPage));
export { connectedHomepage as SettingsPage };