import {
  useState,
  useContext,
  createContext,
  FunctionComponent,
  SyntheticEvent,
  useCallback,
} from "react";
import Snackbar, { SnackbarCloseReason } from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutAPI } from "../helpers/Apis/logout";
import loginWithCookies from "../helpers/Apis/loginWithCookies";
import { fetchCustomerChats } from "../helpers/Apis/messages";
import { AuthContext } from "./AuthContext";
import Pusher from "pusher-js";
import { CustomersContext } from "./CustomersContext";

const SnackBarContext = createContext({
  // updateSnackBarMessage: () => null,
});

const SnackBarProvider = (props) => {
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);

  const updateSnackBarMessage = useCallback((message) => {
    setMessage(message);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const snackbarHandleClose = useCallback((event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  }, []);

  return (
    <SnackBarContext.Provider value={{ updateSnackBarMessage }}>
      {props.children}
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={snackbarHandleClose}
        message={message}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </SnackBarContext.Provider>
  );
};

export { SnackBarContext, SnackBarProvider };
