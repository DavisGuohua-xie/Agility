import React, { Component } from "react";
import { authActions } from '../actions/authActions';
import { connect } from 'react-redux';

class RegistrationPage extends Component {

  constructor(props) {
    super(props);

    // reset login status
    this.props.dispatch(authActions.logout());
    this.state = {
      username: "",
      password: "",
      email: "",
      sent: false
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleLogin(e) {    
    e.preventDefault();

    this.setState({sent: true});
    const {username, password, email} = this.state;
    const { dispatch } = this.props;

    if (username && password && email) {
        dispatch(authActions.register(username, password, email));
      }
    }

  handleChange(e) {
    const {name, value} = e.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <div>
        <h1>Registration Page</h1>
        <form>
          Username: <input onChange={this.handleChange} name="username" type="text" />
          <br />
          Password: <input onChange={this.handleChange} name="password" type="password" />
          <br />
          Email: <input onChange={this.handleChange} name="email" type="email" />
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

const connectedRegistrationPage = connect(mapStateToProps)(RegistrationPage);
export { connectedRegistrationPage as RegistrationPage };
