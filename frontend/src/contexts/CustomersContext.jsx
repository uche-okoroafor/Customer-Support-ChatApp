import React, { useState } from "react";
import axios from "axios";
import { useContext, createContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // import Paper from "@mui/material/Paper";
import { logoutAPI } from "../helpers/Apis/logout";
import loginWithCookies from "../helpers/Apis/loginWithCookies";
import { fetchCustomers } from "../helpers/Apis/fetchCustomers";

const CustomersContext = React.createContext();

const CustomersProvider = (props) => {
  const [customers, setCustomers] = useState([]);
  const [focusedCustomer, setFocusedCustomer] = useState({});
  const navigate = useNavigate();

  const updateFocusedCustomerDetails = (customerDetails) => {
    setFocusedCustomer(customerDetails);
  };

  // console.log(focusedCustomer.id, "customerContext");

  const handleFetchCustomers = async () => {
    await fetchCustomers().then((data) => {
      if (data.success) {
        setCustomers(data.customers);
      } else {
        // don't need to provide error feedback as this just means user doesn't have saved cookies or the cookies have not been authenticated on the backend
        //   setLoggedInUser(null);
        //   navigate("/login");
        console.log("error");
      }
    });
  };

  useEffect(() => {
    handleFetchCustomers();
  }, [navigate]);

  return (
    <CustomersContext.Provider
      value={{
        customers,
        updateFocusedCustomerDetails,
        focusedCustomer,
      }}
    >
      {props.children}
    </CustomersContext.Provider>
  );
};

export { CustomersContext, CustomersProvider };
