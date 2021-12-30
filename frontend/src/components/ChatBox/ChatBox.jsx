import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { ChatContext } from "../../contexts/ChatContext";
import { CustomersContext } from "../../contexts/CustomersContext";
import { Button, TextField } from "@material-ui/core";
import { useDebounce } from "use-debounce";
import useStyles from "./useStyles";
import { SnackBarContext } from "../../contexts/SnackBarContext";
import {
  sendMessage,
  addAgentToCustomerChat,
  updateChatStatus,
  sendEmailNotification,
} from "../../helpers/Apis/messages";
import SendIcon from "@mui/icons-material/Send";
import { v4 as uuidv4 } from "uuid";

const title = " Support: Answer to your enquiry";

export default function ChatBox() {
  const { updateDisplayedChats, displayedChats, handleFetchCustomerChats } =
    useContext(ChatContext);
  const { focusedCustomer } = useContext(CustomersContext);
  const { loggedInUser, isAgent } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [debouncedMessage] = useDebounce();
  const classes = useStyles();
  const { updateSnackBarMessage } = useContext(SnackBarContext);

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
  const mail = ` Hi ${messageDetails.customerName},the answer to your enquiry is now avaliable , please kindly check the customer support application for more details.Thanks`;

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
        }).then((data) => {
          if (data.success) {
            return;
          } else {
            updateSnackBarMessage(data.message);
          }
        });
      }
    }
  };

  useEffect(() => {
    isAgent && handleAddProcessingStatus();
  }, [debouncedMessage]);

  // handleAddAgentToCustomerChat Adds the responding agent to the customer chat

  const handleAddAgentToCustomerChat = () => {
    for (let index = displayedChats.length - 1; index >= 0; index--) {
      if (displayedChats[index].agentId === "No Agent") {
        return addAgentToCustomerChat(
          String(displayedChats[index].id),
          String(loggedInUser.id)
        )
          .then((data) => {
            updateSnackBarMessage(
              "Responding Agent has been added to customer question"
            );
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
        if (data.success) {
          //customer will receive email notification when ever the support agent responds
          isAgent && sendEmailNotification({ mail, title });
          return handleFetchCustomerChats(messageDetails.customerId);
        } else {
          console.log(data);
          updateSnackBarMessage(data.message);
        }
      })
      .catch((err) => {
        updateSnackBarMessage("Something went wrong,please try again later");
        console.error(err);
      });
    setMessage("");
  };

  return (
    <>
      <TextField
        variant="outlined"
        id="chatbox"
        fullWidth
        style={{ background: "white", margin: 0, borderRadius: "5px" }}
        margin="normal"
        name="chatbox"
        className={classes.textField}
        autoFocus
        size="small"
        label="Type your message"
        value={message}
        disabled={!displayedChats.length && isAgent ? true : false}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <Button
        color="primary"
        variant="contained"
        disabled={!displayedChats.length && isAgent ? true : false}
        onClick={handleSendMessage}
        style={{ margin: "0 10px" }}
        endIcon={<SendIcon />}
      >
        send
      </Button>
    </>
  );
}
