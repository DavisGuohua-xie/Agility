import React from 'react';

import styles from '../../styles/login1.module.css';

import {Form, Button, Input, 
    Label, FormGroup, Modal, 
    ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

const LoginForm1 = props => {
    return (
        <div className={styles.container}>
            <div className={styles.center}>
                <h2 className={styles.loginHeader}>Agility</h2>

                <Form>
                    <FormGroup className={styles.formgroup}>
                        <Label for="usernameInput" className={styles.label}>Email address</Label>
                        <Input type="email" name="username" id="usernameInput" placeholder="Email address" onChange={props.onInputChange}/>
                    </FormGroup>

                    <FormGroup className={styles.formgroup}>
                        <Label for="passwordInput">Password</Label>
                        <Input type="password" name="password" id="passwordInput" placeholder="Password" onChange={props.onInputChange}/>
                    </FormGroup>

                    <FormGroup check className={styles.formgroup}>
                        <Label check>
                            <Input type="checkbox" />{' '}
                            Remember me
                        </Label>
                    </FormGroup>
                </Form>
                <a className={styles.forgotPass} onClick={props.onToggleForgot}>Forgot password?</a>
                <Button type="submit" color="primary" className={styles.customBtn} onClick={props.onLogin} disabled={props.ajaxRequested}>Log in</Button>
                <Button type="submit" color="primary" className={`${styles.customBtn} ${styles.registerButton}` } 
                    onClick={props.onToggleReg} disabled={props.ajaxRequested}>Register</Button>


                {/* 
                * modal for password reset
                */}
                <Modal isOpen={props.isOpenForgot} toggle={props.onToggleForgot} className={props.className}>
                    <ModalHeader toggle={props.onToggleForgot}>Recover password</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="recoverUsername">Email address</Label>
                                <Input type="email" name="recoverUsername" id="recoverUsername" 
                                    placeholder="Email address" onChange={props.onInputChange}/>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={props.onPasswordReset}>Send reset link</Button>{' '}
                        <Button color="secondary" onClick={props.onToggleForgot}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                {/* modal for registration */}
                <Modal isOpen={props.isOpenReg} toggle={props.onToggleReg} className={props.className}>
                    <ModalHeader toggle={props.onToggleReg}>New User Registration</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="registerUsername">Username</Label>
                                <Input type="text" name="registerUsername" id="registerUsername"
                                    placeholder="Username" onChange={props.onInputChange}/>
                            </FormGroup>

                            <FormGroup>
                                <Label for="registerEmail">Email address</Label>
                                <Input type="email" name="registerEmail" id="registerEmail" 
                                    placeholder="Email address" onChange={props.onInputChange}/>
                            </FormGroup>

                            <FormGroup>
                                <Label for="registerPassword">Password</Label>
                                <Input type="password" name="registerPassword" id="registerPassword" 
                                    placeholder="Password" onChange={props.onInputChange}/>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={props.onCreateAccount} disabled={props.ajaxRequested}>Create Account</Button>{' '}
                        <Button color="secondary" onClick={props.onToggleReg}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    );
};

export default LoginForm1;