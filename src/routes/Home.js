import { dbService } from 'fbase';
import { addDoc, collection, onSnapshot} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);

    useEffect(() => {
        onSnapshot(collection(dbService, "nweet"), (snapshot) => {
            const newArray = snapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(newArray);
        });
    }, []);

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
        
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target: {value},
        } = event;
        setNweet(value); 
    };

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
            <input type="submit" value="Nweet" />
        </form>
        <div>
            {nweets.map((nweet)=>(
                <div key={nweet.id}>
                    <h4>{nweet.text}</h4>
                </div>
            ))}
        </div>
        </>
    );
};

export default Home;