import React, {
    Component
} from 'react';
import API from '../api/Api'
import LoginForm1 from './login/LoginForm1';

export default class LoginPage extends Component {
  
  constructor(props) {
        super(props);
    
        this.state = {
            username: "",
            password: "",
            email: "",
            isOpenReg: false,
            isOpenForgot: false
        }


        this.handleLogin = this.handleLogin.bind(this);
        this.handleCreateAccount = this.handleCreateAccount.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleToggleForgot = this.handleToggleForgot.bind(this);
        this.handleToggleReg = this.handleToggleReg.bind(this);
    }
  
    handleLogin() {
        let username = this.state.username;
        let password = this.state.password;

        if (username && password) {
          this.props.actions.login(username, password, this.props.history);
        }
    }

    handleCreateAccount() {
        let username = this.state.username;
        let password = this.state.password;
        let email = this.state.email;

        if (username && password && email) {
          this.props.actions.register(username, password, email, this.props.history);
        }
    }

    handleInputChange(e) {
        let value = e.target.value;
        this.setState({
            [e.target.name]: value
        });
    }

    handleToggleReg() {
        this.setState({
            isOpenReg: !this.state.isOpenReg
        });
    }

    handleToggleForgot() {
        this.setState({
            isOpenForgot: !this.state.isOpenForgot
        });
    }

    render() {
        return <LoginForm1 
            onInputChange={this.handleInputChange}
            onLogin={this.handleLogin}
            onCreateAccount={this.handleCreateAccount}
            onToggleForgot={this.handleToggleForgot}
            isOpenForgot={this.state.isOpenForgot}
            onToggleReg={this.handleToggleReg}
            isOpenReg={this.state.isOpenReg}
          />;
    }
}


function mapDispatchToProps(dispatch) {
  return { 
    actions: bindActionCreators(authActions, dispatch)
  };
}

const connectedLoginPage = withRouter(connect(null, mapDispatchToProps)(LoginPage));
export { connectedLoginPage as LoginPage };
