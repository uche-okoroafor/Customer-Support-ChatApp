import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { ChatContext } from "../../contexts/ChatContext";
import { CustomersContext } from "../../contexts/CustomersContext";
import { Button, Grid, Box, Typography, TextField } from "@material-ui/core";
import { useDebounce } from "use-debounce";

import {
  sendMessage,
  addAgentToCustomerChat,
  updateChatStatus,
} from "../../helpers/Apis/messages";
import SendIcon from "@mui/icons-material/Send";
import { v4 as uuidv4 } from "uuid";

export default function ChatBox() {
  const { updateDisplayedChats, displayedChats, handleFetchCustomerChats } =
    useContext(ChatContext);
  const { focusedCustomer } = useContext(CustomersContext);
  const { loggedInUser, isAgent } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [debouncedMessage] = useDebounce();

  const messageDetails = {
    customerId: isAgent ? String(focusedCustomer.id) : String(loggedInUser.id),
    customerEmail: isAgent ? focusedCustomer.email : loggedInUser.email,
    customerName: isAgent ? focusedCustomer.name : loggedInUser.name,
    agentId: isAgent ? String(loggedInUser.id) : "No Agent",
    message,
    status: "Sending",
    senderId: String(loggedInUser.id),
    senderName: loggedInUser.name,
    customerSatisfied: "No",
    id: uuidv4(),
  };

  const handleAddProcessingStatus = () => {
    for (let index = displayedChats.length - 1; index >= 0; index--) {
      if (
        displayedChats[index].agentId === "No Agent" &&
        displayedChats[index].status === "Not Answered"
      ) {
        return updateChatStatus({
          isSatisfied: displayedChats[index].customerSatisfied,
          chatId: String(displayedChats[index].id),
          customerId: String(displayedChats[index].customerId),
          event: "Update Status",
          status: "In Progress",
        })
          .then((data) => {
            console.log(data, "In Progress");
          })
          .catch((err) => console.error);
      }
    }
  };

  useEffect(() => {
    isAgent && handleAddProcessingStatus();
  }, [debouncedMessage]);

  const handleAddAgentToCustomerChat = () => {
    for (let index = displayedChats.length - 1; index >= 0; index--) {
      if (displayedChats[index].agentId === "No Agent") {
        return addAgentToCustomerChat(
          String(displayedChats[index].id),
          String(loggedInUser.id)
        )
          .then((data) => {
            // console.log(data, "added");
          })
          .catch((err) => console.error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!message) {
      return;
    }
    if (isAgent) {
      handleAddAgentToCustomerChat();
    }
    updateDisplayedChats([...displayedChats, messageDetails]);
    const messageInstance = { ...messageDetails };
    messageInstance.status = isAgent ? "supportAgent" : "Not Answered";
    sendMessage(messageInstance)
      .then((data) => {
        if (data.success)
          return handleFetchCustomerChats(
            messageDetails.customerId,
            "updateOne"
          );
      })
      .catch((err) => console.log(err));
    setMessage("");
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          display: "flex",
          alignItems: "center",
          background: "white",
        }}
      >
        <TextField
          variant="outlined"
          id="chatbox"
          fullWidth
          style={{ width: "40rem" }}
          margin="normal"
          name="chatbox"
          autoFocus
          label="Type your message"
          value={message}
          disabled={!displayedChats.length && isAgent ? true : false}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <Box>
          <Button
            color="primary"
            disabled={!displayedChats.length && isAgent ? true : false}
            onClick={handleSendMessage}
            style={{ margin: "0 10px" }}
            endIcon={<SendIcon />}
          >
            send
          </Button>
        </Box>
      </Box>
    </>
  );
}
