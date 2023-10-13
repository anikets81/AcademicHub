import React, { useEffect } from "react";
import Calender from "./Calender";
import Navbar from "components/Navbar";
import Courses from "./Courses";
import { Box, Grid, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
const Dashboard = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses);

  const getCourseInfo = async () => {
    const response = await fetch(
      `http:://localhost:3001/${enrollment}/studentInfo`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    ); //this should send all the info related to student.
    const data = await response.json();
    dispatch(setCourseCompletion({ classesCommenced: data }));
  };

  useEffect(() => {
    getCourseInfo();
  }, []); //// eslint-disable-line react-hooks/exhaustive-deps

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
            {courses.map(
              ({
                courseCode,
                courseName,
                courseCode,
                totalClasses,
                classesCommenced,
              }) => (
                <Box sx={{ ml: "2rem", mt: "3rem" }}>
                  <Courses
                    key={courseCode}
                    courseName={courseName}
                    courseCode={courseCode}
                    totalClasses={totalClasses}
                    classesCommenced={classesCommenced}
                  />
                </Box>
              )
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
