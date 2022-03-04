import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({userObj}) => {
    const [nweets, setNweets] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
          query(collection(dbService, "nweet"), orderBy("createdAt", "desc")),
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
        <div className="container">
          <NweetFactory userObj={userObj}/>
          <div style={{ marginTop: 30 }}>
              {nweets.map((nweet)=>(
                  <Nweet 
                      key={nweet.id} 
                      nweetObj={nweet}
                      isOwner={nweet.creatorId===userObj.uid}
                  />
              ))}
          </div>
        </div>
    );
};

export default Home;