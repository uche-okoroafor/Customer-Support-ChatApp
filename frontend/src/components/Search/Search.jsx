import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { ChatContext } from "../../contexts/ChatContext";
import { fetchSearchedCustomers } from "../../helpers/Apis/fetchCustomers";
import { useDebounce } from "use-debounce";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import {
  Button,
  Grid,
  Box,
  Typography,
  TextField,
  Paper,
} from "@material-ui/core";
import { sendMessage } from "../../helpers/Apis/messages";
import { Stack } from "@mui/material";

export default function Search({
  setSearch,
  search,
  setSearchResult,
  searchResult,
  handleFetchCustomer,
}) {
  const { displayedChats } = useContext(ChatContext);
  const { loggedInUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [debouncedSearch] = useDebounce(search, 1000);
  console.log(debouncedSearch, "debouncedSearch");
  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    async function fetchSearchedOptions() {
      // send request to backend API to get users limited to 20.
      setLoading(true);

      fetchSearchedCustomers(debouncedSearch)
        .then((data) => {
          if (data.success) {
            setSearchResult(data.message.data);
          } else {
            setSearchResult([]);
          }
          console.log(data);
        })
        .catch((err) => console.log(err));

      setLoading(false);
    }

    fetchSearchedOptions();
  }, [debouncedSearch]);

  return (
    <>
      <TextField
        variant="outlined"
        id="search"
        fullWidth
        margin="normal"
        name="search"
        autoComplete="search"
        autoFocus
        label="Search by Customer name or Active Message"
        value={search}
        //   disabled={!displayedChats.length && isAgent ? true : false}
        onChange={handleChange}
      />
      <List
        dense
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      >
        {searchResult &&
          searchResult.map((list) => (
            <ListItem
              key={list.id}
              secondaryAction={
                <Checkbox
                  edge="end"
                  inputProps={{ "aria-labelledby": list.id }}
                />
              }
              disablePadding
            >
              <ListItemButton
                onClick={() => handleFetchCustomer(list.customerId)}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={list.senderName}
                    src={`/static/images/avatar.jpg`}
                  />
                </ListItemAvatar>
                <ListItemText id={list.id} primary={list.senderName} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </>
  );
}
