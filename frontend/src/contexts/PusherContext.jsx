import React, { useState } from "react";
import axios from "axios";
import { useContext, createContext, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutAPI } from "../helpers/Apis/logout";
import loginWithCookies from "../helpers/Apis/loginWithCookies";
import { fetchCustomerChats } from "../helpers/Apis/messages";
import { AuthContext } from "./AuthContext";
import Pusher from "pusher-js";
import { CustomersContext } from "./CustomersContext";

const PusherContext = React.createContext();

const PusherProvider = (props) => {
  const { loggedInUser } = useContext(AuthContext);
  const [pusherData, setPusherData] = useState(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const resetPusherData = () => {
    setPusherData(null);
  };

  const subscribeToPusher = () => {
    const pusher = new Pusher("be523c427aa3a2c84a9d", {
      cluster: "eu",
      encrypted: true,
    });
    const channel = pusher.subscribe("chat");

    channel.bind("message", (data) => {
      // console.log(data, "pusherData");

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
