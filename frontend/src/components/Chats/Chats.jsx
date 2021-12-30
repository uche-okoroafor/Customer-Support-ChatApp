import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useMediaQuery, useTheme } from "@mui/material";
import { ChatContext } from "../../contexts/ChatContext";
import { v4 as uuidv4 } from "uuid";
import { stringAvatar } from "../../Pages/Dashboard/useStyles";
import { Avatar } from "@mui/material";

import moment from "moment";
import {
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@material-ui/core";
import { updateChatStatus } from "../../helpers/Apis/messages";
import { Stack } from "@mui/material";

export default function Chats() {
  const { displayedChats, updateDisplayedChats, isLoading } =
    useContext(ChatContext);
  const { loggedInUser } = useContext(AuthContext);
  const [isSubmitting, setSubmitting] = useState(false);
  const theme = useTheme();
  const isDesktopView = useMediaQuery(theme.breakpoints.up(500));

  const handleUpdateChatStatus = ({
    chatId,
    customerId,
    event,
    isSatisfied,
    status,
  }) => {
    setSubmitting(true);
    updateChatStatus({ chatId, customerId, event, isSatisfied, status })
      .then((data) => {
        updateDisplayedChats(data.message);
        setSubmitting(false);
      })
      .catch((err) => console.error(err));
    setSubmitting(false);
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
  const handleChatStatus = (chat) => {
    if (chat === "supportAgent") {
      if (loggedInUser.userHandler === "supportAgent") {
        return "Sent";
      }

      return "seen";
    }
    return chat;
  };

  const handleChatStatusColor = (chat) => {
    if (chat === "Not Answered") {
      return "#BA000D";
    } else if (chat === "In Progress") {
      return "#e5ce00";
    }
    return "#095EB3";
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayedChats, isLoading]);
  return (
    <>
      <Stack spacing={3} justifyContent="center">
        {displayedChats.length && !isLoading ? (
          displayedChats.map((chat, index) => (
            <Paper
              key={uuidv4()}
              className="chats"
              style={{
                width: isDesktopView ? "50%" : "80%",
                margin: "10px",
                alignSelf:
                  String(chat.senderId) === String(loggedInUser.id)
                    ? "flex-end"
                    : "flex-start",
                visibility:
                  displayedChats.length && !isLoading ? "visible" : "hidden",
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
                    sx={{
                      border: "1px solid #1976D2",
                      // bgcolor: deepPurple[500],
                    }}
                    {...stringAvatar(chat.senderName.toUpperCase(), 45, 45)}
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
                        background: handleChatStatusColor(chat.status),
                        borderRadius: "5px",
                        color: "white",
                        padding: "3px 5px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {handleChatStatus(chat.status)}
                    </Typography>
                  </Box>

                  {displaySetSatisfiedBtn(chat) && (
                    <Button
                      color="primary"
                      variant="contained"
                      disabled={isSubmitting}
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
                      {" "}
                      {isSubmitting ? (
                        <CircularProgress
                          style={{
                            color: "white",
                            fontSize: 0,
                            width: "30px",
                            height: "30px",
                          }}
                        />
                      ) : (
                        "click here if your Question has been answered"
                      )}
                    </Button>
                  )}
                  {displaySetAnsweredBtn(chat) && (
                    <Button
                      color="primary"
                      variant="contained"
                      disabled={isSubmitting}
                      onClick={() =>
                        handleUpdateChatStatus({
                          chatId: String(chat.id),
                          customerId: String(chat.customerId),
                          event: "Update Status",
                          isSatisfied: chat.customerSatisfied,
                          status: "Answered",
                        })
                      }
                    >
                      {" "}
                      {isSubmitting ? (
                        <CircularProgress
                          style={{
                            color: "white",
                            fontSize: 0,
                            width: "30px",
                            height: "30px",
                          }}
                        />
                      ) : (
                        "Customer is Satisfied , Click to set chat to Answered"
                      )}
                    </Button>
                  )}
                </Stack>
              </Box>
            </Paper>
          ))
        ) : (
          <Box
            display="flex"
            justifyContent={"center"}
            alignItems={"center"}
            style={{ height: "70vh" }}
          >
            {isLoading ? (
              <CircularProgress
                style={{
                  color: "white",
                  fontSize: 0,
                  width: "30px",
                  height: "30px",
                }}
              />
            ) : (
              <Typography style={{ color: "white" }} align="center">
                {" "}
                No chats to display
              </Typography>
            )}
          </Box>
        )}
      </Stack>
    </>
  );
}
