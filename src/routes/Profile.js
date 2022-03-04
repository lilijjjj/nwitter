import { authService, dbService } from 'fbase';
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Nweet from "components/Nweet";
import { updateProfile } from 'firebase/auth';

const Profile = ({ userObj, refreshUser }) => {
    const history = useHistory();
    const [nweets, setNweets] = useState([]);
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

    useEffect(() => {
        const unsubscribe = onSnapshot(
          query(
            collection(dbService, "nweets"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt", "desc")
          ),
          (snapshot) => {
            const newArray = snapshot.docs.map((document) => ({
              id: document.id,
              ...document.data(),
            }));
            setNweets(newArray);
          }
        );
        return () => {
          unsubscribe();
        };
      }, []);
    
    return (
        <div className='conTainer'>
            <form onSubmit={onSubmit} className="profileForm">
                <input onChange={onChange} type="text" placeholder='Display name' value={newDisplayName} autoFocus className='="formInput'/>
                <input type="submit" value="Update Profile" className='formBtn' style={{ marginTop: 10, }}/>
            </form>
        <span className='formBtn cancelBtn logOut' onClick={onLogOutClick}>Log Out</span>
        </div>
    );
};

export default Profile;