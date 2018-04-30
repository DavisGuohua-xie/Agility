import React, { Component } from "react";
import { authActions } from '../actions/authActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

class LoginPage extends Component {

  constructor(props) {
    super(props);

    // reset login status
    this.props.actions.logout();
    this.state = {
      username: "",
      password: "",
      sent: false
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleLogin(e) {    
    e.preventDefault();

    this.setState({sent: true});
    const {username, password} = this.state;

    if (username && password) {
        this.props.actions.login(username, password, this.props.history);
      }
    }

  handleChange(e) {
    const {name, value} = e.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <div>
        <h1>Login Page</h1>
        <form>
          Username: <input onChange={this.handleChange} name="username" type="text" />
          <br />
          Password: <input onChange={this.handleChange} name="password" type="password" />
          <br />
        </form>

        <button onClick={this.handleLogin}>Login </button>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return { 
    actions: bindActionCreators(authActions, dispatch)
  };
}

const connectedLoginPage = withRouter(connect(null,   mapDispatchToProps)(LoginPage));
export { connectedLoginPage as LoginPage };
