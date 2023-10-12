import React from "react";
import Calender from "./Calender";
import Navbar from "components/Navbar";
import Courses from "./Courses";
import { Box, Grid, Paper } from "@mui/material";
const Dashboard = () => {
  return (
    <>
      <Navbar />

      <Grid container>
        <Grid item xs={6}>
          <Paper
            style={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#DFEBF6",
            }}
          >
            <Box sx={{ width: "30rem", mb: "10rem" }}>
              <Calender />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper
            style={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              // alignItems: "center",
              // justifyContent: "center",
              backgroundColor: "#DFEBF6",
            }}
          >
            <Box sx={{ ml: "2rem", mt: "3rem" }}>
              <Courses />
            </Box>
            <Box sx={{ ml: "2rem", mt: "3rem" }}>
              <Courses />
            </Box>
            <Box sx={{ ml: "2rem", mt: "3rem" }}>
              <Courses />
            </Box>
            <Box sx={{ ml: "2rem", mt: "3rem" }}>
              <Courses />
            </Box>
            <Box sx={{ ml: "2rem", mt: "3rem" }}>
              <Courses />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
