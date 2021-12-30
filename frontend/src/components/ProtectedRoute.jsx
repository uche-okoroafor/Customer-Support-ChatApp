import React, { useState, useEffect, useContext } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = () => {
  const { loggedInUser } = useContext(AuthContext);
  return loggedInUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
