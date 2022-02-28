import { v4 as uuidv4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { dbService, storage } from "fbase";
import React, { useState } from "react";

const NweetFactory = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] =useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl= "";
        if (attachment !== "") {
            const attachmentRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
            await uploadString(attachmentRef, attachment, 'data_url');
            attachmentUrl = await getDownloadURL(attachmentRef);
        }
        await addDoc(collection(dbService, "nweet"), {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        });
        setNweet("");
        setAttachment("");    
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target: { value },
        } = event;
        setNweet(value);
    };

    const onFileChange = (event) => {
        const {
            target: { files }, 
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        if (Boolean(theFile)){
            reader.readAsDataURL(theFile);
        }
    };

    const onClearAttachment = () => setAttachment("");

    return (
        <form onSubmit={onSubmit}>
            <input
             value={nweet} 
             onChange={onChange} 
             type="text" 
             placeholder="What's on your mind?" 
             maxLength={120}
            />
            <input type="file" accept='image/*' onChange={onFileChange}/>
            <input type="submit" value="Nweet" />
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px" />
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
            )}
        </form>
    );
};

export default NweetFactory;
