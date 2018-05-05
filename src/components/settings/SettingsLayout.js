import React from 'react';
import { Container } from 'reactstrap';

import styles from '../../styles/SettingsLayout.module.css';
import profile from '../../img/unknown_profile.svg';

const SettingsLayout = props => {
    return (
        <Container>
            <h1 style={{marginTop: '15px'}}>My Account</h1>

            <div className={styles.containerDiv}>
                <div className={styles.profilePicDiv}>
                    <img src={profile} alt='Profile'/>
                </div>

                <div className={styles.formDiv}>
                    <form method='post' onSubmit={props.onSave}>
                        {/* TODO: complete form fields */}
                    </form>
                </div>
            </div>
        </Container>
    );
};

export default SettingsLayout;