import * as React from "react";
import Box from "@mui/material/Box";
import { Typography, Button } from "@mui/material";
import BorderLinearProgress from "./BorderLinearProgress";
const MIN = 0;
const MAX = 45; //total classes
const value = 25; // total classes done
const normalise = (value) => ((value - MIN) * 100) / (MAX - MIN);

const Course = () => {
  const courseName = "Software Engeneering";
  const courseId = "CA-326";
  return (
    <Box>
      <Button sx={{ width: "20rem" }} variant="contained">
        Software Engineering CA-217
      </Button>
      <BorderLinearProgress
        sx={{ width: "20rem", borderRadius: 0 }}
        variant="determinate"
        value={normalise(value)}
      />
    </Box>
  );
};

export default Course;
