import React, { useState } from "react";
// import FlexBetween from "components/FlexBetween";
import {
  Container,
  Paper,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  useMediaQuery,
  Box,
  Button,
  useTheme,
  TextField,
} from "@mui/material";

// import { Formik } from "formik";
// import * as yup from "yup";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";

// const loginSchema = yup.object().shape({
//   enrollment: yup.number().required("Required"),
//   password: yup.string().required("required"),
// });

// const initialValuesLogin = {
//   enrollment: "",
//   password: "",
// };

const Form = () => {
  const [userType, setUserType] = useState("faculty");
  const [pageType, setPageType] = useState("login");
  //   const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //   const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/dashboard");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
  };
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "50px" }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="userType"
            name="userType"
            value={userType}
            onChange={handleUserTypeChange}
          >
            <FormControlLabel
              value="faculty"
              control={<Radio />}
              label="Faculty"
            />
            <FormControlLabel
              value="student"
              control={<Radio />}
              label="Student"
            />
          </RadioGroup>
        </FormControl>
        {userType === "faculty" ? (
          <form onSubmit={handleFormSubmit}>
            <TextField label="Faculty Username" fullWidth margin="normal" />
            <TextField
              label="Faculty Password"
              type="password"
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" fullWidth type="submit">
              Login as Faculty
            </Button>
          </form>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <TextField label="Student Username" fullWidth margin="normal" />
            <TextField
              label="Student Password"
              type="password"
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" fullWidth type="submit">
              Login as Student
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default Form;
