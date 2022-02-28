import { authService, dbService } from 'fbase';
import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';

const Profile = ({ userObj, refreshUser }) => {
    const history = useHistory();

    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, {
                    displayName: newDisplayName
                });
            refreshUser();
        }
    };
    
    return (
        <>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} type="text" placeholder='Display name' value={newDisplayName} />
                <input type="submit" value="Update Profile" />
            </form>
        <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};

export default Profile;