import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import useStyles from "./useStyles";
import { useNavigate } from "react-router-dom";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Paper, Typography } from "@mui/material";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { login } from "../../helpers/Apis/login";
import { SnackBarContext } from "../../contexts/SnackBarContext";

const Login = () => {
  const { updateLoginContext } = useContext(AuthContext);
  const [isSubmitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { updateSnackBarMessage } = useContext(SnackBarContext);
  const classes = useStyles();

  const handleSubmit = ({ email, password }) => {
    setSubmitting(true);
    login({ email, password }).then((data) => {
      if (data.error) {
        setSubmitting(false);
        updateSnackBarMessage(data.error.message);
      } else if (data.success) {
        localStorage.setItem("user-token", data.token);
        updateLoginContext(data.data);
      } else {
        // should not get here from backend but this catch is for an unknown issue
        console.error({ data });

        setSubmitting(false);
        updateSnackBarMessage("An unexpected error occurred. Please try again");
      }
    });
  };

  return (
    <Box className={classes.root}>
      <Box style={{ position: "relative" }}>
        <Typography
          sx={{
            fontSize: { sm: "1.8rem", xs: "1.5rem" },
          }}
          className={classes.welcomeText}
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
          className={classes.createAccountBtn}
        >
          {" "}
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate("/sign-up")}
          >
            <Typography variant="subtitle">Create account</Typography>
          </Button>
        </Box>
      </Box>

      <Box display="flex" justifyContent="center">
        <Paper
          sx={{
            width: { lg: "30%", md: "40%", sm: "50%", xs: "70%" },
            marginTop: "2rem",
            padding: "1rem 2rem",
            backgroundColor: "rgb(1 ,106, 66 ,0.8)",
            color: "white",
          }}
          className={classes.formContainer}
        >
          <Typography variant="h6" align="center">
            Sign in
          </Typography>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={Yup.object().shape({
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
              <form
                onSubmit={handleSubmit}
                style={{ padding: "1rem" }}
                noValidate
              >
                <Box>
                  <TextField
                    variant="outlined"
                    id="email"
                    fullWidth
                    margin="normal"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    className={classes.textField}
                    size="small"
                    label={"Email"}
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
                    size="small"
                    className={classes.textField}
                    name="password"
                    autoComplete="current-password"
                    helperText={touched.password ? errors.password : ""}
                    error={touched.password && Boolean(errors.password)}
                    value={values.password}
                    onChange={handleChange}
                  />
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
                      "Login"
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

export default Login;
