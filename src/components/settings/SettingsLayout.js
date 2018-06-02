import React from "react";
import { Container, Button } from "reactstrap";

import { Form, FormGroup, Label, Input } from "reactstrap";

import styles from "../../styles/SettingsLayout.module.css";
import profile from "../../img/unknown_profile.svg";

const SettingsLayout = props => {
    return (
        <Container>
            <h1 style={{ marginTop: "15px" }}>My Account</h1>

            <div className={styles.containerDiv}>
                <div className={styles.profilePicDiv}>
                    <img src={profile} alt="Profile" />
                </div>

                <div className={styles.formDiv}>
                    <Form method="post" onSubmit={props.onSave}>
                        <FormGroup>
                            <Label htmlFor="fname">First Name</Label>
                            <Input
                                type="text"
                                name="fname"
                                id="fname"
                                value={props.fname}
                                onChange={props.onValueChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="lname">Last Name</Label>
                            <Input
                                type="text"
                                name="lname"
                                id="lname"
                                value={props.lname}
                                onChange={props.onValueChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                value={props.email}
                                onChange={props.onValueChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                type="text"
                                name="username"
                                id="username"
                                value={props.username}
                                readOnly
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="password">Change password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="New password"
                                onChange={props.onValueChange}
                            />
                            <Input
                                type="confpassword"
                                name="confpassword"
                                id="confpassword"
                                placeholder="Confirm new password"
                                onChange={props.onValueChange}
                            />
                        </FormGroup>

                        <div className={`input-group mb-3 ${styles.notif}`}>
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="emailNotif">
                                    Summary email frequency
                                </label>
                            </div>
                            <select
                                className="custom-select"
                                id="emailNotif"
                                name="emailFreq"
                                onChange={props.onValueChange}
                                defaultValue={props.emailFreq ? props.emailFreq : "0"}
                            >
                                <option value="0">None</option>
                                <option value="1">Daily</option>
                                <option value="2">Weekly</option>
                            </select>
                        </div>

                        <Button type="submit" color="primary" style={{ float: "right" }} onClick={props.onHandleSave}>
                            Save
                        </Button>
                    </Form>
                </div>
            </div>
        </Container>
    );
};

export default SettingsLayout;
