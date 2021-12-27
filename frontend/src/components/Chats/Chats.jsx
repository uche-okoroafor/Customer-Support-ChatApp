import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { ChatContext } from "../../contexts/ChatContext";
import { v4 as uuidv4 } from "uuid";
import { stringAvatar } from "./useStyles";

import moment from "moment";
import {
  Button,
  Grid,
  Box,
  Typography,
  TextField,
  Paper,
  Avatar,
} from "@material-ui/core";
import { sendMessage, updateChatStatus } from "../../helpers/Apis/messages";
import { Stack } from "@mui/material";

export default function Chats() {
  const { displayedChats, updateDisplayedChats } = useContext(ChatContext);
  const { loggedInUser, isAgent } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  const handleUpdateChatStatus = ({
    chatId,
    customerId,
    event,
    isSatisfied,
    status,
  }) => {
    updateChatStatus({ chatId, customerId, event, isSatisfied, status })
      .then((data) => {
        // displayedChats[displayedChats.length - 1] = data.message;
        updateDisplayedChats(data.message);
        console.log(data.message, "message");
      })
      .catch((err) => console.log(err));
  };

  const scrollToBottom = () => {
    const messageBox =
      document.getElementsByClassName("chats")[
        document.getElementsByClassName("chats").length - 1
      ];

    setTimeout(() => {
      if (messageBox) {
        messageBox.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const displaySetSatisfiedBtn = (chat) => {
    if (
      String(chat.senderId) === String(chat.customerId) &&
      chat.agentId !== "No Agent" &&
      chat.customerSatisfied === "No" &&
      loggedInUser.userHandler === "customer"
    ) {
      return true;
    }

    return false;
  };

  const displaySetAnsweredBtn = (chat) => {
    if (
      chat.customerSatisfied === "Yes" &&
      loggedInUser.userHandler === "supportAgent" &&
      chat.status !== "Answered"
    ) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayedChats]);
  return (
    <>
      <Stack spacing={3} justifyContent="center">
        {displayedChats.length ? (
          displayedChats.map((chat, index) => (
            <Paper
              key={uuidv4()}
              className="chats"
              style={{
                width: "50%",
                margin: "10px",
                alignSelf:
                  String(chat.senderId) === String(loggedInUser.id)
                    ? "flex-end"
                    : "flex-start",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent={"space-between"}
                style={{
                  borderBottom: "1px solid black",
                  borderStartStartRadius: "5px",
                  borderStartEndRadius: "5px",
                  padding: "5px",
                  background: "#016A42",
                  color: "white",
                }}
              >
                <Box display="flex" alignItems="center">
                  <Avatar
                    style={{ border: "1px solid #1976D2" }}
                    {...stringAvatar(chat.senderName.toUpperCase(), 45, 45)}
                    // src={`/hello world`}
                  />
                  <Typography style={{ margin: "0 10px " }}>
                    {" "}
                    {chat.senderName}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography style={{ fontSize: "0.8rem" }}>
                    {moment(chat.created_at).format("MMMM Do YYYY")}
                  </Typography>
                  <Typography style={{ fontSize: "0.8rem" }}>
                    {moment(chat.created_at).format("h:mm:ss a")}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ padding: "20px 10px", overflowWrap: "break-word" }}>
                {chat.message}
              </Box>
              <Box sx={{ padding: "10px" }}>
                <Stack spacing={2}>
                  <Box display={"flex"} justifyContent={"flex-start"}>
                    <Typography
                      style={{
                        background: "yellow",
                        borderRadius: "5px",
                        padding: "3px 5px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {chat.status}
                    </Typography>
                  </Box>
                  {displaySetSatisfiedBtn(chat) && (
                    <Button
                      color="primary"
                      onClick={() =>
                        handleUpdateChatStatus({
                          chatId: String(chat.id),
                          customerId: String(chat.customerId),
                          event: "Update isSatisfied",
                          isSatisfied: "Yes",
                          status: chat.status,
                        })
                      }
                      style={{ fontSize: "0.9rem" }}
                    >
                      click here if your Question has been answered
                    </Button>
                  )}

                  {displaySetAnsweredBtn(chat) && (
                    <Button
                      color="primary"
                      onClick={() =>
                        handleUpdateChatStatus({
                          chatId: String(chat.id),
                          customerId: String(chat.customerId),
                          event: "Update Status",
                          isSatisfied: chat.customerSatisfied,
                          status: "Answered",
                        })
                      }
                      // style={{ fontSize: "0.6rem" }}
                    >
                      Customer is Satisfied , Click to set chat to Answered
                    </Button>
                  )}
                </Stack>
              </Box>
            </Paper>
          ))
        ) : (
          <Typography align="center"> No chats to display</Typography>
        )}
      </Stack>
    </>
  );
}
