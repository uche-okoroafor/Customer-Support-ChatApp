import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useNavigate } from "react-router-dom"; // import Paper from "@mui/material/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { signUp } from "../../helpers/Apis/signUp";

const SignUp = (props) => {
  const { errorMessage, updateLoginContext } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userHandler, setUserHandler] = useState("");
  const navigate = useNavigate();

  function handleSubmit(data) {
    signUp({
      name,
      email,
      password,
      password_confirmation: password,
      userHandler,
    }).then((data) => {
      if (data.error) {
        console.error({ error: data.error.message });
        // setSubmitting(false);
        // updateSnackBarMessage(data.error.message);
      } else if (data.success) {
        localStorage.setItem("user-token", data.token);
        console.log(data, "data");
        updateLoginContext(data.data);
      } else {
        // should not get here from backend but this catch is for an unknown issue
        console.error({ data });

        // setSubmitting(false);
        // updateSnackBarMessage('An unexpected error occurred. Please try again');
      }
    });
  }
  return (
    <Container>
      <Typography variant="h3">Sign-Up</Typography>
      <Button onClick={() => navigate("/login")}>signin</Button>

      <Box display="flex" justifyContent="center">
        <Paper style={{ width: "70%", marginTop: "3rem", padding: "5rem" }}>
          <Box>
            <TextField
              variant="outlined"
              id="name"
              fullWidth
              margin="normal"
              name="name"
              autoComplete="name"
              autoFocus
              label="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Box>
          <Box>
            <TextField
              variant="outlined"
              id="email"
              fullWidth
              margin="normal"
              name="email"
              autoComplete="email"
              autoFocus
              label="email"
              // helperText={touched.email ? errors.email : ''}
              // error={touched.email && Boolean(errors.email)}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Box>
          <Box>
            <TextField
              variant="outlined"
              id="password"
              label="password"
              type="password"
              fullWidth
              margin="normal"
              name="password"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Box>

          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              {/* <InputLabel id="demo-simple-select-label">Handler</InputLabel> */}
              <Select
                variant="outlined"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={userHandler}
                label="Handler"
                onChange={(e) => {
                  setUserHandler(e.target.value);
                }}
              >
                <MenuItem value={"customer"}>Customer</MenuItem>
                <MenuItem value={"supportAgent"}>Support Agent</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Button onClick={() => handleSubmit()} variant="contained">
              Sign Up
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp;
