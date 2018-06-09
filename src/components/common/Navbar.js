import React from "react";
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
} from "reactstrap";

import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { authActions } from "../../actions/authActions";

import Avatar from "react-avatar";

import styles from "../../styles/navbar.module.css";

import history from "../../history";

class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            isOpen: false,
            projectID: props.projID
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    logout() {
        history.replace("/login");
        console.log(this.props);
        this.props.actions.logout();
    }

    render() {
        let projName = this.props.projName ? this.props.projName : null;
        let zind = this.props.zIndex ? this.props.zIndex : 100000;
        console.log(projName);
        return (
            <div>
                <Navbar
                    color="light"
                    expand="md"
                    style={{ zIndex: zind }}
                    className={styles.mainNav}
                >
                    <Link to="/" className={`${styles.navbarBrand} navbar-brand`}>
                        Agility
                    </Link>
                    <NavbarToggler onClick={this.toggle} />

                    <Nav className={styles.navbarCenter} navbar>
                        {projName && (
                            <NavItem>
                                <Link
                                    to={`/${this.state.projectID}/overview`}
                                    style={{
                                        color: "black",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        fontSize: "1.2em"
                                    }}
                                    className="nav-link"
                                >
                                    {projName}
                                </Link>
                            </NavItem>
                        )}
                    </Nav>

                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            {projName && (
                                <NavItem>
                                    <Link
                                        to={`/${this.state.projectID}/chat`}
                                        style={{ color: "black" }}
                                        className="nav-link"
                                        title="Chat"
                                    >
                                        <i className={`fas fa-envelope ${styles.chatIcon}`} />
                                    </Link>
                                </NavItem>
                            )}
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle
                                    nav
                                    className={`${styles.name} ${styles.nameInProject}`}
                                >
                                    <Avatar
                                        name={this.props.name + " " + this.props.lname}
                                        round={true}
                                        maxInitials={2}
                                        size={30}
                                        textSizeRatio={2}
                                    />
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem className={styles.dropdownItem}>
                                        <Link
                                            to="/myaccount"
                                            style={{ textDecoration: "none", color: "#212529" }}
                                        >
                                            My Account
                                        </Link>
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem
                                        className={styles.dropdownItem}
                                        onClick={this.logout}
                                    >
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

function mapStateToProps(state, ownProps) {
    return {
        name: state.authReducer.first_name,
        lname: state.authReducer.last_name
    };
}

const connectedNavbar = withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
export { connectedNavbar as NavBar };
