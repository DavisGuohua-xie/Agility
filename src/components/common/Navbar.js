import React from 'react';
import {
Collapse,
Navbar,
NavbarToggler,
Nav,
NavItem,
UncontrolledDropdown,
DropdownToggle,
DropdownMenu,
DropdownItem
} from 'reactstrap';

import {
Link
} from 'react-router-dom';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router';
import {authActions} from '../../actions/authActions';

import styles from '../../styles/navbar.module.css';

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      isOpen: false,
      projectID: props.projID
    };

    console.log(`navbar props:`);
    console.log(this.props.actions);

  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  
  logout() {
    this.props.history.push("/login");
    this.props.actions.logout(this.props.history);
  }

  render() {

    let projName = this.props.projName ? this.props.projName : null;
    let zind = this.props.zIndex ? this.props.zIndex : 100000;
    console.log(projName);
    return (
      <div>
        <Navbar color="dark" dark expand="md"  style={{zIndex: zind}}>
          <Link to="/" className={`${styles.navbarBrand} navbar-brand`}>Agility</Link>
          <NavbarToggler onClick={this.toggle} />
          
          <Nav className={styles.navbarCenter} navbar>
            {projName && <NavItem>
              <Link to={`/${this.state.projectID}/overview`} className="nav-link">{projName}</Link>
            </NavItem>}
          </Nav>
          
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar >
              {projName && <NavItem>
                <Link to={`/${this.state.projectID}/chat`} className="nav-link">Chat</Link>
              </NavItem>}
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Name
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem className={styles.dropdownItem}>
                    <Link to="/myaccount" style={{textDecoration: 'none', color: '#212529'}}>My Account</Link>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem className={styles.dropdownItem} onClick={this.logout}>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators(authActions, dispatch)
  };
}

const connectedNavbar = withRouter(connect(null, mapDispatchToProps)(NavBar));
export { connectedNavbar as NavBar };