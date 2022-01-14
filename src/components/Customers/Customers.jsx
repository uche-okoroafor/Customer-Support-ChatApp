import React, { useContext, useState } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import { CustomersContext } from "../../contexts/CustomersContext";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { fetchCustomerChats } from "../../helpers/Apis/messages";
import Search from "../Search/Search";
import { stringAvatar } from "../../Pages/Dashboard/useStyles";
import { SnackBarContext } from "../../contexts/SnackBarContext";

export default function Customers({ setDisplayChat }) {
  const {
    updateDisplayedChats,
    changeChatStatusToAnswerdAfter24Hour,
    updateIsLoading,
  } = useContext(ChatContext);
  const { customers, updateFocusedCustomerDetails } =
    useContext(CustomersContext);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setLoadingSearch] = useState(false);
  const { updateSnackBarMessage } = useContext(SnackBarContext);

  //fetch customers that sent a message

  const handleFetchCustomer = async (customerId) => {
    updateIsLoading(true);
    fetchCustomerChats(String(customerId))
      .then((data) => {
        updateFocusedCustomerDetails(data.customerDetails);
        updateDisplayedChats(data.messages);

        // changeChatStatusToAnswerdAfter24Hour checks if the message has no reply within 24hours
        changeChatStatusToAnswerdAfter24Hour(data.messages);
        updateIsLoading(false);
        setDisplayChat(true);
      })
      .catch((err) => {
        updateIsLoading(false);
        updateSnackBarMessage("Something went wrong , please try again later");
        console.error(err);
      });
  };

  return (
    <>
      <Search
        setSearch={setSearch}
        search={search}
        setSearchResult={setSearchResult}
        searchResult={searchResult}
        handleFetchCustomer={handleFetchCustomer}
        setLoadingSearch={setLoadingSearch}
      />

      <Box display="flex" justifyContent="center">
        {" "}
        {isLoading && (
          <CircularProgress
            style={{
              color: "white",
              fontSize: 0,
              width: "30px",
              height: "30px",
            }}
          />
        )}
      </Box>

      {!searchResult.length && customers ? (
        <List
          sx={{
            width: "100%",
            paddingTop: 0,
          }}
        >
          {customers.map((customer) => (
            <ListItem
              key={customer.id}
              style={{
                background: "white",
                margin: "10px auto",
                borderRadius: "5px",
                width: "95%",
              }}
              disablePadding
            >
              <ListItemButton onClick={() => handleFetchCustomer(customer.id)}>
                <ListItemAvatar>
                  <Avatar
                    style={{ border: "1px solid #1976D2" }}
                    {...stringAvatar(customer.name.toUpperCase(), 45, 45)}
                  />
                </ListItemAvatar>
                <ListItemText id={customer.id} primary={customer.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        !searchResult.length && (
          <Typography>No customer is avaliable</Typography>
        )
      )}
    </>
  );
}
