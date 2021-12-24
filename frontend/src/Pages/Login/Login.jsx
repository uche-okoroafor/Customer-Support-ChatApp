import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";

import { useNavigate } from "react-router-dom"; // import Paper from "@mui/material/Paper";
// import Container from "@mui/material/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { login } from "../../helpers/Apis/login";

const Login = () => {
  const { errorMessage, updateLoginContext } = useContext(AuthContext);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  //   const handleChange = e => {
  //     setState({
  //         ...fields,
  //         [e.target.id] : e.target.value
  //     })
  // }

  const handleSubmit = () => {
    login({ email, password }).then((data) => {
      if (data.error) {
        // setSubmitting(false);
        // updateSnackBarMessage(data.error.message);
      } else if (data.success) {
        localStorage.setItem("user-token", data.token);
        updateLoginContext(data.data);
      } else {
        // should not get here from backend but this catch is for an unknown issue
        console.error({ data });

        // setSubmitting(false);
        // updateSnackBarMessage("An unexpected error occurred. Please try again");
      }
    });
  };

  return (
    <Container>
      <Typography variant="h3">Login</Typography>
      <Button onClick={() => navigate("/sign-up")}> create account</Button>

      <Box display="flex" justifyContent="center">
        <Paper style={{ width: "70%", marginTop: "3rem", padding: "5rem" }}>
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
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              // helperText={touched.email ? errors.email : ''}
              // error={touched.email && Boolean(errors.email)}
              // value={values.email}
              // onChange={handleChange}
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

          <Box>
            <Button variant="contained" onClick={() => handleSubmit()}>
              Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
