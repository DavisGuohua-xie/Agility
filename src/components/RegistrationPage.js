import React, { Component } from "react";
import { authActions } from '../actions/authActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

class RegistrationPage extends Component {

  constructor(props) {
    super(props);

    // reset login status
    this.props.actions.logout();
    this.state = {
      username: "",
      password: "",
      email: "",
      sent: false
    };

    this.handleRegistration = this.handleRegistration.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleRegistration(e) {    
    e.preventDefault();

    this.setState({sent: true});
    const {username, password, email} = this.state;

    if (username && password && email) {
        this.props.actions.register(username, password, email, this.props.history);
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

        <button onClick={this.handleRegistration}>Register</button>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return { 
      actions: bindActionCreators(authActions, dispatch)
  };
}

const connectedRegistrationPage = withRouter(connect(null, mapDispatchToProps)(RegistrationPage));
export { connectedRegistrationPage as RegistrationPage };
