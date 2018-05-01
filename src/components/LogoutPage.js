import React, { Component } from "react";
import { authActions } from "../actions/authActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";

class LogoutPage extends Component {
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
