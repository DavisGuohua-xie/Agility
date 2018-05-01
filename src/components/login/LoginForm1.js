import React from 'react';

import styles from '../../styles/login1.module.css';

import {Form, Button, Input, Label, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

const LoginForm1 = props => {
    return (

        <div className={styles.pageContainer}>
            <h2 className={styles.loginHeader}>Agility</h2>

            <Form>
                <FormGroup>
                    <Label for="usernameInput">Email address</Label>
                    <Input type="email" name="username" id="usernameInput" placeholder="Email address" onChange={props.onInputChange}/>
                </FormGroup>

                <FormGroup>
                    <Label for="passwordInput">Password</Label>
                    <Input type="password" name="password" id="passwordInput" placeholder="Password" onChange={props.onInputChange}/>
                </FormGroup>

                <FormGroup check>
                    <Label check>
                        <Input type="checkbox" />{' '}
                        Remember me
                    </Label>
                </FormGroup>
            </Form>
            <a className={styles.forgotPass} onClick={props.onToggle}>Forgot password?</a>
            <Button type="submit" color="primary" className={styles.customBtn} onClick={props.onLogin}>Log in</Button>
            <Button type="submit" color="primary" className={`${styles.customBtn} ${styles.registerButton}`} onClick={props.onCreateAccount}>Register</Button>


            <Modal isOpen={props.isOpen} toggle={props.onToggle} className={props.className}>
                <ModalHeader toggle={props.onToggle}>Recover password</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="recoverUsername">Email address</Label>
                            <Input type="email" name="recoverUsername" id="recoverUsername" placeholder="Email address" onChange={props.onInputChange}/>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={props.onPasswordReset}>Send reset link</Button>{' '}
                    <Button color="secondary" onClick={props.onToggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default LoginForm1;