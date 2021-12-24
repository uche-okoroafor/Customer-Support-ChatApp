import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { ChatContext } from "../../contexts/ChatContext";
import { CustomersContext } from "../../contexts/CustomersContext";
import { logout } from "../../helpers/Apis/logout";
import { Button, Grid, Box, Typography } from "@material-ui/core";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import { fetchCustomerChats } from "../../helpers/Apis/messages";
import Search from "../Search/Search";

export default function Customers() {
  const { updateDisplayedChats, changeChatStatusToAnswerdAfter24Hour } =
    useContext(ChatContext);
  const { customers, updateFocusedCustomerDetails } =
    useContext(CustomersContext);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const handleFetchCustomer = async (customerId) => {
    fetchCustomerChats(String(customerId))
      .then((data) => {
        updateFocusedCustomerDetails(data.customerDetails);
        updateDisplayedChats(data.messages);
        changeChatStatusToAnswerdAfter24Hour(data.messages);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Search
        setSearch={setSearch}
        search={search}
        setSearchResult={setSearchResult}
        searchResult={searchResult}
        handleFetchCustomer={handleFetchCustomer}
      />
      {!searchResult.length && customers ? (
        <List
          dense
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {customers.map((customer) => (
            <ListItem
              key={customer.id}
              secondaryAction={
                <Checkbox
                  edge="end"
                  inputProps={{ "aria-labelledby": customer.id }}
                />
              }
              disablePadding
            >
              <ListItemButton onClick={() => handleFetchCustomer(customer.id)}>
                <ListItemAvatar>
                  <Avatar
                    alt={customer.name}
                    src={`/static/images/avatar.jpg`}
                  />
                </ListItemAvatar>
                <ListItemText id={customer.id} primary={customer.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No customer is avaliable</Typography>
      )}
    </>
  );
}
