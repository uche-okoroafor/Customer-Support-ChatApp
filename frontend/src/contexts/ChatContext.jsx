import React, { useState } from "react";
import axios from "axios";
import { useContext, createContext, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutAPI } from "../helpers/Apis/logout";
import loginWithCookies from "../helpers/Apis/loginWithCookies";
import { fetchCustomerChats, updateChatStatus } from "../helpers/Apis/messages";
import { AuthContext } from "./AuthContext";
import Pusher from "pusher-js";
import { CustomersContext } from "./CustomersContext";
import { PusherContext } from "./PusherContext";
import moment from "moment";
const ChatContext = React.createContext();

const ChatProvider = (props) => {
  const { loggedInUser } = useContext(AuthContext);
  const { pusherData, resetPusherData } = useContext(PusherContext);
  const [displayedChats, setDisplayedChats] = useState([]);
  const { focusedCustomer, updateFocusedCustomerDetails } =
    useContext(CustomersContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const updateDisplayedChats = (chats) => {
    setDisplayedChats(chats);
  };
  // console.log(displayedChats, "allchats");
  const handleFetchCustomerChats = async (customerId, params) => {
    fetchCustomerChats(customerId)
      .then((data) => {
        // if (params === "updateAll") {

        updateDisplayedChats(data.messages);
        updateFocusedCustomerDetails(data.customerDetails);
        changeChatStatusToAnswerdAfter24Hour(data.messages);
        // } else {
        //   displayedChats[displayedChats.length - 1] =
        //     data.messages[data.messages.length - 1];
        // }
      })
      .catch((err) => console.log(err));
  };

  const changeChatStatusToAnswerdAfter24Hour = (messages) => {
    for (const message of messages) {
      const hours = moment().diff(moment(message.created_at), "hours");
      if (
        message.agentId !== "No Agent" &&
        message.status !== "Answered" &&
        message.status !== "supportAgent" &&
        hours >= 24
      ) {
        updateChatStatus({
          chatId: String(message.id),
          customerId: String(message.customerId),
          agentId: String(message.agentId),
          isSatisfied: message.customerSatisfied,
          status: "Answered",
        })
          .then((data) => {
            // console.log(data, "hours");
          })
          .catch((err) => console.error(err));
      }
    }
  };

  const eventSendConditions = () => {
    if (
      String(pusherData.message.customerId) === String(focusedCustomer.id) &&
      String(pusherData.message.senderId) !== String(loggedInUser.id) &&
      (pusherData.event === "Send Chat" ||
        pusherData.event === "Update isSatisfied")
    ) {
      return true;
    }

    return false;
  };

  const eventUpdateConditions = () => {
    if (
      String(pusherData.message.customerId) === String(focusedCustomer.id) &&
      String(pusherData.message.senderId) === String(loggedInUser.id) &&
      pusherData.event === "Update Status"
    ) {
      return true;
    }

    return false;
  };

  const updateNewMessages = () => {
    console.log(pusherData, eventSendConditions(), eventUpdateConditions());
    if (eventSendConditions()) {
      displayedChats[displayedChats.length - 1] = pusherData.message;
      console.log("pusher");
      handleFetchCustomerChats(pusherData.customerId, "updateOne");
      // setTimeout(() => {
      //   resetPusherData();
      // }, 100);
    } else if (eventUpdateConditions()) {
      handleFetchCustomerChats(pusherData.customerId, "updateOne");
      console.log("pusher");
    }
  };

  useEffect(() => {
    if (pusherData) {
      return updateNewMessages();
    }
    if (loggedInUser && loggedInUser.userHandler === "customer") {
      handleFetchCustomerChats(String(loggedInUser.id), "updateAll");
    }

    // if (pathname === "/login" || pathname === "/sign-up") {
    //   updateDisplayedChats([]);
    // }
  }, [loggedInUser, pusherData]);

  return (
    <ChatContext.Provider
      value={{
        displayedChats,
        updateDisplayedChats,
        handleFetchCustomerChats,
        changeChatStatusToAnswerdAfter24Hour,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatProvider };
