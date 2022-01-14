import React, { useContext, useState, useEffect } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { AuthContext } from "../../contexts/AuthContext";
import { ChatContext } from "../../contexts/ChatContext";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import useStyles from "./useStyles";
import { Button, Grid, Box, Typography } from "@material-ui/core";
import Customers from "../../components/Customers/Customers";
import ChatBox from "../../components/ChatBox/ChatBox";
import Chats from "../../components/Chats/Chats";
import { Stack } from "@mui/material";
import { Avatar } from "@mui/material";
import { Paper } from "@mui/material";
import { stringAvatar } from "./useStyles";

export default function Dashboard(props) {
  const { loggedInUser, logout, isAgent } = useContext(AuthContext);
  const { handleFetchCustomerChats, updateIsLoading } = useContext(ChatContext);
  const classes = useStyles();
  const [displayChat, setDisplayChat] = useState(true);
  const theme = useTheme();
  const isDesktopView = useMediaQuery(theme.breakpoints.up(960));

  const toggleContainer = () => {
    setDisplayChat(!displayChat);
  };
  // for responsiveness
  useEffect(() => {
    if (isDesktopView) {
      setDisplayChat(true);
    }
  }, [isDesktopView]);

  // fetch customer chats when the page is mounted
  useEffect(() => {
    if (loggedInUser && loggedInUser.userHandler === "customer") {
      handleFetchCustomerChats(String(loggedInUser.id));
      updateIsLoading(true);
    }
  }, []);

  return (
    <>
      <Box className={classes.root} style={{ paddingTop: "5rem" }}>
        <Box
          display="flex"
          sx={{
            height: "4rem",
            position: "fixed",
            width: "100%",
            left: 0,
            top: 0,
            color: "white",
            background: "rgb(1 ,106, 66 ,0.8)",
            zIndex: 1,
          }}
          className={classes.navbar}
        >
          <Stack
            flexDirection="row"
            alignItems="center"
            style={{ flexGrow: 1 }}
          >
            <Box sx={{ margin: "10px" }}>
              <Avatar
                {...stringAvatar(loggedInUser.name.toUpperCase(), 45, 45)}
              />
            </Box>

            <Box sx={{ margin: "0 10px" }}>
              <Typography variant="h6">{loggedInUser.name}</Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              margin: "0 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* isMobileView */}
            {isAgent && (
              <IconButton
                sx={{
                  margin: "0 20px",
                  height: "50px",
                  width: "50px",
                  display: isDesktopView ? "none" : "block",
                }}
                color="inherit"
                aria-label="close"
                variant="contained"
                size="medium"
                onClick={toggleContainer}
              >
                {displayChat ? <SearchIcon /> : <ChatIcon />}
              </IconButton>
            )}

            <Button
              color="primary"
              variant="contained"
              onClick={logout}
              endIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Box>
        </Box>
        <Grid container>
          {displayChat && (
            <Grid
              item
              xs={isAgent ? 12 : 12}
              sm={isAgent ? 12 : 12}
              md={isAgent ? 8 : 12}
            >
              <Paper
                id="chatContainer"
                sx={{
                  width: isAgent
                    ? { md: "85%", xs: "90%" }
                    : { md: "60%", sm: "80%", xs: "90%" },
                  height: "86vh",
                  margin: "0 auto",
                  position: "relative",
                  background: "rgb(249, 249, 249,0.5)",
                  display: "flex",
                  flexDirection: "column",
                }}
                className={classes.chatElevation}
              >
                <Box className={classes.chats}>
                  <Chats />
                </Box>
                <Box
                  sx={{
                    position: "relative",
                    bottom: 0,
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    background: "#016A42",
                    borderRadius: "5px",
                  }}
                >
                  <ChatBox />
                </Box>
              </Paper>
            </Grid>
          )}
          {isAgent && (isDesktopView || !displayChat) && (
            <Grid item xs={12} md={4}>
              <Paper
                className={classes.customers}
                sx={{
                  width: { xs: "90%", sm: "80%" },
                  height: "86vh",
                  margin: "0 auto",
                  background: "rgb(249, 249, 249,0.5)",
                  overflow: "hidden",
                }}
              >
                <Customers setDisplayChat={setDisplayChat} />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}
