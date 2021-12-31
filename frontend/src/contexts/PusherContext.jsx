import React, { useState } from "react";
import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import Pusher from "pusher-js";

const PusherContext = React.createContext();

const PusherProvider = (props) => {
  const { loggedInUser } = useContext(AuthContext);
  const [pusherData, setPusherData] = useState(null);

  const resetPusherData = () => {
    setPusherData(null);
  };

  const subscribeToPusher = () => {
    const pusher = new Pusher(process.env.REACT_APP_MIX_PUSHER_APP_KEY, {
      cluster: process.env.REACT_APP_PUSHER_CLUSTER,
      encrypted: true,
    });
    const channel = pusher.subscribe("chat");

    channel.bind("message", (data) => {
      setPusherData(data);
    });
  };

  useEffect(() => {
    subscribeToPusher();
  }, [loggedInUser]);

  return (
    <PusherContext.Provider
      value={{
        pusherData,
        resetPusherData,
      }}
    >
      {props.children}
    </PusherContext.Provider>
  );
};

export { PusherContext, PusherProvider };
