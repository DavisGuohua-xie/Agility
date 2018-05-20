import React, { Component } from "react";
import { authActions } from "../actions/authActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { Parse } from 'parse';
class LogoutPage extends Component {

  constructor(props) {
    super(props);
    
    var currentUser = Parse.User.current();
        if (!currentUser) {
            this.props.history.push("/login");
        }
  }

  componentWillMount() {
    this.props.actions.logout(this.props.history);
  }

  render() {
    return (
      <div>
        <h1> Logging out... </h1>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch)
  };
}

const connectedLogoutPage = withRouter(
  connect(null, mapDispatchToProps)(LogoutPage)
);

export { connectedLogoutPage as LogoutPage };
