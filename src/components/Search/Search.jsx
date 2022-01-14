import React, { useContext, useEffect } from "react";
import { fetchSearchedCustomers } from "../../helpers/Apis/fetchCustomers";
import { useDebounce } from "use-debounce";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { stringAvatar } from "../../Pages/Dashboard/useStyles";
import useStyles from "./useStyles";
import { SnackBarContext } from "../../contexts/SnackBarContext";
import { Box, TextField } from "@material-ui/core";

export default function Search({
  setSearch,
  search,
  setSearchResult,
  searchResult,
  handleFetchCustomer,
  setLoadingSearch,
}) {
  const [debouncedSearch] = useDebounce(search, 1000);
  const { updateSnackBarMessage } = useContext(SnackBarContext);
  const classes = useStyles();
  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (!search) {
      return;
    }
    async function fetchSearchedOptions() {
      // send request to backend API to get users limited to 20.
      setLoadingSearch(true);

      fetchSearchedCustomers(debouncedSearch)
        .then((data) => {
          if (data.success) {
            const fiteredData = data.message.data.filter(
              (user) => String(user.senderId) === String(user.customerId)
            );
            setSearchResult(fiteredData);
            setLoadingSearch(false);
          } else {
            setSearchResult([]);
            setLoadingSearch(false);
          }
        })
        .catch((err) => {
          updateSnackBarMessage(
            "Something went wrong , please try again later"
          );
          console.error(err);
        });

      setLoadingSearch(false);
    }

    fetchSearchedOptions();
  }, [debouncedSearch]);

  return (
    <>
      <Box
        style={{
          borderStartStartRadius: "5px",
          borderStartEndRadius: "5px",
          background: "#016A42",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <TextField
          variant="outlined"
          id="search"
          fullWidth
          margin="normal"
          name="search"
          size="small"
          className={classes.textField}
          autoComplete="search"
          label="Search for a Customer"
          value={search}
          style={{
            background: "white",
            borderRadius: "5px",
            width: "90%",
          }}
          onChange={handleChange}
        />
      </Box>
      <List dense sx={{ width: "100%", maxWidth: 360 }}>
        {searchResult &&
          searchResult.map((list) => (
            <ListItem
              key={list.id}
              style={{
                background: "white",
                margin: "10px auto",
                borderRadius: "5px",
                width: "95%",
              }}
              disablePadding
            >
              <ListItemButton
                onClick={() => handleFetchCustomer(list.customerId)}
              >
                <ListItemAvatar>
                  <Avatar
                    style={{ border: "1px solid #1976D2" }}
                    {...stringAvatar(list.senderName.toUpperCase(), 45, 45)}
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
