import { dbService, storageService } from 'fbase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import Nweet from "components/Nweet"
import { v4 as uuidv4 } from "uuid";

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] =useState("");

    useEffect(() => {
        (async () => {
            const nweetArr = [];
            const query = await getDocs(collection(dbService, "nweet"))
            query.forEach((doc) => {
                nweetArr.push({id: doc.id,...doc.data()});
                console.log(doc.data().creatorId);

            })
            setNweets(nweetArr);
        })()
        }, [nweet]);

    const onSubmit = async (event) => {
        event.preventDefault();
        
        try {
            await addDoc(collection(dbService, "nweet"), {
                text: nweet,
                createdAt: Date.now(),
                creatorId: userObj.uid,
            });
            setNweet("");    
        } catch (e) {
            console.log(e);
        }
        const attachmentRef = storageService
            .ref()
            .child(`${userObj.uid}/${uuidv4()}`);
        const response =await attachmentRef.putString(attachment, "data_url");
        console.log(response);
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target: {value},
        } = event;
        setNweet(value);
    };

    const onFileChange = (event) => {
        const {
            target: {files}, 
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: {result},
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment("");

    return (
        <>
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
        <div>
            {nweets.map((nweet)=>(
                <Nweet 
                key={nweet.id} 
                nweetObj={nweet}
                isOwner={nweet.creatorId===userObj.uid}
                />
            ))}
        </div>
        </>
    );
};

export default Home;