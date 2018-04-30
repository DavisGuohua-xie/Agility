import React, { Component } from "react";
import { authActions } from '../actions/authActions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class LoginPage extends Component {

  constructor(props) {
    super(props);

    // reset login status
    this.props.dispatch(authActions.logout());
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
    const { dispatch } = this.props;

    if (username && password) {
        dispatch(authActions.login(username, password, this.props.history));
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

function mapStateToProps(state) {
  return { 
  };
}

const connectedLoginPage = withRouter(connect(mapStateToProps)(LoginPage));
export { connectedLoginPage as LoginPage };
