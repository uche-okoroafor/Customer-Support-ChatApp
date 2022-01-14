import React, { useState, useCallback } from "react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SnackBarContext } from "./SnackBarContext";
import { fetchCustomers } from "../helpers/Apis/fetchCustomers";

const CustomersContext = React.createContext();

const CustomersProvider = (props) => {
  const [customers, setCustomers] = useState([]);
  const [focusedCustomer, setFocusedCustomer] = useState({});
  const navigate = useNavigate();
  const { updateSnackBarMessage } = useContext(SnackBarContext);

  // updateFocusedCustomerDetails updates current customer's chats and details to the setFocusedCustomer state

  const updateFocusedCustomerDetails = (customerDetails) => {
    setFocusedCustomer(customerDetails);
  };

  // handleFetchCustomers makes an api request to get current  customer chats or clicked customer chats

  const handleFetchCustomers = useCallback(async () => {
    await fetchCustomers().then((data) => {
      if (data.success) {
        setCustomers(data.customers);
      } else {
        updateSnackBarMessage(data.success);
        console.error(data);
        updateSnackBarMessage("Something went wrong,please try again later");
      }
    });
  }, [navigate]);

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
