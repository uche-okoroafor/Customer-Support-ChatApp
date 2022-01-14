import React, { useContext, useState } from "react";
import LoginIcon from "@mui/icons-material/Login";
import { AuthContext } from "../../contexts/AuthContext";
import { Paper } from "@mui/material";
import { Box, Typography } from "@mui/material";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { useNavigate } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import * as Yup from "yup";
import useStyles from "./useStyles";
import { Formik } from "formik";
import { signUp } from "../../helpers/Apis/signUp";
import { SnackBarContext } from "../../contexts/SnackBarContext";

const SignUp = (props) => {
  const { updateLoginContext } = useContext(AuthContext);
  const classes = useStyles();
  const [isSubmitting, setSubmitting] = useState(false);
  const { updateSnackBarMessage } = useContext(SnackBarContext);
  const navigate = useNavigate();
  const [displayError, setDisplayError] = useState(false);

  const handleSubmit = ({ name, email, password, userHandler }) => {
    if (!userHandler) {
      return setDisplayError(true);
    }
    setSubmitting(true);
    signUp({
      name,
      email,
      password,
      password_confirmation: password,
      userHandler,
    }).then((data) => {
      if (!data.success) {
        console.error({ error: data.message });
        setSubmitting(false);
        updateSnackBarMessage(data.message.email[0]);
      } else if (data.success) {
        localStorage.setItem("user-token", data.token);
        updateLoginContext(data.data);
      } else {
        //   // should not get here from backend but this catch is for an unknown issue
        console.error({ error: data.message });
        setSubmitting(false);
        updateSnackBarMessage("An unexpected error occurred. Please try again");
      }
    });
  };

  return (
    <Box className={classes.root}>
      <Box style={{ position: "relative" }}>
        <Typography
          className={classes.welcomeText}
          sx={{
            fontSize: { sm: "1.8rem", xs: "1.5rem" },
          }}
          align="center"
        >
          Welcome to our customer
          <br /> support room
        </Typography>

        <Box
          sx={{
            textAlign: { xs: "right" },
            position: { xs: "relative", sm: "absolute" },
          }}
          className={classes.loginBtn}
        >
          {" "}
          <Button
            variant="contained"
            color="primary"
            size="small"
            endIcon={<LoginIcon />}
            onClick={() => navigate("/login")}
          >
            <Typography variant="subtitle">Sign in</Typography>
          </Button>
        </Box>
      </Box>

      <Box display="flex" justifyContent="center">
        <Paper
          className={classes.formContainer}
          sx={{
            width: { lg: "30%", md: "40%", sm: "50%", xs: "70%" },
            marginTop: "2rem",
            padding: "1rem 2rem",
            backgroundColor: "rgb(1 ,106, 66 ,0.8)",
            color: "white",
          }}
        >
          <Typography variant="h6" align="center">
            Create an account
          </Typography>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("name is required"),
              // userHandler: Yup.string().required("userHandler is required"),
              email: Yup.string()
                .required("Email is required")
                .email("Email is not valid"),
              password: Yup.string()
                .required("Password is required")
                .max(100, "Password is too long")
                .min(6, "Password too short"),
            })}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <form onSubmit={handleSubmit} noValidate>
                <Box>
                  <TextField
                    variant="outlined"
                    id="name"
                    fullWidth
                    margin="normal"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    label="Name"
                    className={classes.textField}
                    size="small"
                    helperText={touched.name ? errors.name : ""}
                    error={touched.name && Boolean(errors.name)}
                    value={values.name}
                    onChange={handleChange}
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
                    size="small"
                    label="Email"
                    className={classes.textField}
                    helperText={touched.email ? errors.email : ""}
                    error={touched.email && Boolean(errors.email)}
                    value={values.email}
                    onChange={handleChange}
                  />
                </Box>
                <Box>
                  <TextField
                    variant="outlined"
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    name="password"
                    size="small"
                    className={classes.textField}
                    helperText={touched.password ? errors.password : ""}
                    error={touched.password && Boolean(errors.password)}
                    value={values.password}
                    onChange={handleChange}
                  />
                </Box>

                <Box>
                  <TextField
                    id="userHandler"
                    label="Handler"
                    name="userHandler"
                    select
                    variant="outlined"
                    fullWidth
                    size="small"
                    className={classes.textField}
                    value={values.userHandler ? values.userHandler : ""}
                    helperText={touched.userHandler ? errors.userHandler : ""}
                    error={touched.userHandler && Boolean(errors.userHandler)}
                    onChange={(e) => {
                      handleChange(e);
                      setDisplayError(false);
                    }}
                  >
                    <MenuItem value={"customer"}>Customer</MenuItem>
                    <MenuItem value={"supportAgent"}>Support Agent</MenuItem>
                  </TextField>
                  {displayError && (
                    <Typography
                      style={{
                        color: "#F44336",
                        fontSize: "0.8rem",
                        marginLeft: "1rem",
                        fontWeight: "lighter",
                      }}
                    >
                      Handler is required
                    </Typography>
                  )}
                </Box>

                <Box
                  display="flex"
                  justifyContent="center"
                  style={{
                    paddingTop: "2rem",
                  }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                    style={{ padding: "10px 50px" }}
                    size="large"
                    color="primary"
                  >
                    {isSubmitting ? (
                      <CircularProgress
                        style={{
                          color: "white",
                          fontSize: 0,
                          width: "30px",
                          height: "30px",
                        }}
                      />
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Box>
  );
};

export default SignUp;
