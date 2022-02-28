import React, { useEffect, useState } from 'react';
import AppRouter from "./Router";
import { authService } from 'fbase';

function App() {
  const [init, setInit] =useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(()=>{
    authService.onAuthStateChanged((user)=>{
      if (user) {
        setUserObj({
          uid: user.uid,
          displayName: user.displayName,
        });
      } else {
        setUserObj(false);
      }
      setInit(true);
    });
  },[]);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      uid: user.uid,
      displayName: user.displayName,
    });
  };

  return (
  <>
    {init ? (
      <AppRouter 
        refreshUser={refreshUser}
        isLoggedIn={Boolean(userObj)} 
        userObj={userObj} 
      />
    ) : ( 
      "initializing..."
    )}
  </>
  );
}

export default App;