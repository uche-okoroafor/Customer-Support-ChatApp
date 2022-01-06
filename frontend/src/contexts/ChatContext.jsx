import React, { useState } from "react";
import { useContext, useEffect, useCallback } from "react";
import { fetchCustomerChats, updateChatStatus } from "../helpers/Apis/messages";
import { AuthContext } from "./AuthContext";
import { SnackBarContext } from "./SnackBarContext";
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
  const [isLoading, setLoading] = useState(false);
  const { updateSnackBarMessage } = useContext(SnackBarContext);

  // updateDisplayedChats updates chats to the displayedChats state

  const updateDisplayedChats = (chats) => {
    setDisplayedChats(chats);
  };

  // handleFetchCustomers makes an api request to get current  customer chats or clicked customer chats
  const handleFetchCustomerChats = useCallback(async (customerId) => {
    fetchCustomerChats(customerId)
      .then((data) => {
        if (data.success) {
          updateDisplayedChats(data.messages);
          updateFocusedCustomerDetails(data.customerDetails);
          changeChatStatusToAnswerdAfter24Hour(data.messages);
          setLoading(false);
        } else {
          updateSnackBarMessage(data.messages);
        }
      })
      .catch((err) => {
        updateSnackBarMessage("Something went wrong,please try again later");
        console.error(err);
      });
  }, []);

  // changeChatStatusToAnswerdAfter24Hour changes the status of the customers chat to Answered after 24hours

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
            updateSnackBarMessage("customer chat status updated");
          })
          .catch((err) => {
            updateSnackBarMessage(
              "Something went wrong,please try again later"
            );
            console.error(err);
          });
      }
    }
  };

  // eventSendConditions is the conditions that will be considered before sending the chat to the client or agent
  // it directs  the data to the right customer or agent
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

  // eventUpdateConditions is the conditions that will be considered before updating a chat status

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
    if (eventSendConditions()) {
      displayedChats.push(pusherData.message);
      handleFetchCustomerChats(pusherData.customerId);
    } else if (eventUpdateConditions()) {
      handleFetchCustomerChats(pusherData.customerId);
    }
  };
  const updateIsLoading = (condition) => {
    setLoading(condition);
  };

  useEffect(() => {
    if (pusherData) {
      return updateNewMessages();
    }
    if (!loggedInUser) {
      updateDisplayedChats([]);
    }
  }, [pusherData, loggedInUser]);

  return (
    <ChatContext.Provider
      value={{
        displayedChats,
        updateDisplayedChats,
        handleFetchCustomerChats,
        changeChatStatusToAnswerdAfter24Hour,
        isLoading,
        updateIsLoading,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatProvider };
