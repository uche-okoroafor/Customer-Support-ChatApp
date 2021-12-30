import React, { useState, useContext } from "react";
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // import Paper from "@mui/material/Paper";
import { logoutAPI } from "../helpers/Apis/logout";
import loginWithCookies from "../helpers/Apis/loginWithCookies";
import { useLocation } from "react-router-dom";
import { SnackBarContext } from "./SnackBarContext";

const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const [isAgent, setIsAgent] = useState(false);
  const { pathname } = useLocation();
  const { updateSnackBarMessage } = useContext(SnackBarContext);
  const [loggedInUser, setLoggedInUser] = useState({
    id: "",
    name: "",
    userHandler: "",
    email: "",
  });
  const navigate = useNavigate();

  const updateLoginContext = useCallback(
    (data) => {
      setLoggedInUser(data);
      navigate("/dashboard");
      data.userHandler === "supportAgent"
        ? setIsAgent(true)
        : setIsAgent(false);
    },
    [navigate]
  );
  const logout = useCallback(async () => {
    // needed to remove token cookie
    await logoutAPI()
      .then(() => {
        navigate("/login");
        setLoggedInUser(null);
      })
      .catch((error) => console.error(error));
  }, [navigate]);

  useEffect(() => {
    const checkLoginWithCookies = async () => {
      await loginWithCookies().then((data) => {
        if (data.success) {
          updateSnackBarMessage("you are logged in");
          updateLoginContext(data.data);
          navigate("/dashboard");
        } else {
          if (pathname === "/sign-up" || loggedInUser) {
            return;
          }
          // don't need to provide error feedback as this just means user doesn't have saved cookies or the cookies have not been authenticated on the backend
          setLoggedInUser(null);
          navigate("/login");
        }
      });
    };
    checkLoginWithCookies();
  }, [navigate, updateLoginContext]);

  return (
    <AuthContext.Provider
      value={{
        logout,
        updateLoginContext,
        loggedInUser,
        isAgent,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
