import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
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


import styles from '../../styles/navbar.module.css';

export default class NavBar extends React.Component {
    constructor(props) {
      super(props);

      this.toggle = this.toggle.bind(this);
      this.state = {
        isOpen: false
      };
    }

    toggle() {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
    
    render() {

      let projName = this.props.projName ? this.props.projName : null;
      console.log(projName);
      return (
        <div>
          <Navbar color="dark" dark expand="md">
            <Link to="/" className={styles.navbarBrand}><NavbarBrand>Agility</NavbarBrand></Link>
            <NavbarToggler onClick={this.toggle} />
            
            <Nav className={styles.navbarCenter} navbar>
              {projName && <NavItem>
                <Link to="/" className="nav-link">{projName}</Link>
              </NavItem>}
            </Nav>
            
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                {projName && <NavItem>
                  <Link to="/chat" className="nav-link">Chat</Link>
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
                    <DropdownItem className={styles.dropdownItem}>
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