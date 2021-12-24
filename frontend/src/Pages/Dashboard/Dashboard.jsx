import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { CustomersContext } from "../../contexts/CustomersContext";
// import SendIcon from "@mui/icons-material/Send";
import {
  Button,
  Grid,
  Box,
  Typography,
  Paper,
  Avatar,
  Container,
} from "@material-ui/core";
import Customers from "../../components/Customers/Customers";
import ChatBox from "../../components/ChatBox/ChatBox";
import Chats from "../../components/Chats/Chats";
import { Stack } from "@mui/material";

export default function Dashboard(props) {
  const { loggedInUser, logout, isAgent } = useContext(AuthContext);
  return (
    <>
      <Container style={{ paddingTop: "6rem" }}>
        <Box
          display="flex"
          sx={{
            height: "4rem",
            position: "fixed",
            width: "100%",
            left: 0,
            top: 0,
            background: "blue",
            zIndex: 1,
          }}
        >
          <Stack
            flexDirection="row"
            alignItems="center"
            style={{ flexGrow: 1 }}
          >
            <Box sx={{ margin: "10px" }}>
              <Avatar
                alt={loggedInUser.name}
                src={`/static/images/avatar.jpg`}
              />
            </Box>

            <Box sx={{ margin: "10px" }}>
              <Typography>{loggedInUser.name}</Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              margin: "0 20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button
              style={{
                background: "red",
                color: "white",
              }}
              onClick={logout}
            >
              Logout
            </Button>
          </Box>
        </Box>
        <Grid container>
          <Grid item xs={isAgent ? 8 : 12}>
            <Paper
              style={{
                height: "65vh",
                width: isAgent ? "80%" : "60%",
                margin: "0 auto",
                position: "relative",
                padding: "20px",
                overflow: "hidden",
                overflowY: "scroll",
                paddingBottom: "100px",
                background: "#f9f9f9",
              }}
            >
              <Chats />
              <ChatBox />
            </Paper>
          </Grid>
          {isAgent && (
            <Grid item xs={4}>
              <Paper style={{ height: "80vh" }}>
                <Customers />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}
