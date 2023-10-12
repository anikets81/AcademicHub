import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  InputBase,
} from "@mui/material";
import React from "react";
import FlexBetween from "./FlexBetween";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "state";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  //   const name = `${user.firstName} ${user.lastName}`;
  const fullName = "Aniket Singh";
  const enrollment = "205122013";
  return (
    <FlexBetween padding="1rem 6%" backgroundColor={"#E6E6E6"}>
      <FlexBetween gap="1.7rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem"
          color="whitesmoke"
          onClick={() => navigate("/home")}
        >
          AcademinHub
        </Typography>
      </FlexBetween>
      <FormControl variant="standard" value={fullName}>
        <Select
          value={fullName}
          sx={{
            backgroundColor: "wheat",
            width: "150px",
            borderRadius: "0.25rem",
            p: "0.25rem 1rem",
            "& .MuiSvgIcon-root": {
              pr: "0.25rem",
              width: "3rem",
            },
            "& .MuiSelect-select:focus": {
              backgroundColor: "wheat",
            },
          }}
          //   input={<InputBase />}
        >
          <MenuItem value={fullName}>
            {/* <Typography> */}
            {fullName}- {enrollment}
            {/* </Typography> */}
          </MenuItem>
          <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
        </Select>
      </FormControl>
    </FlexBetween>
  );
};

export default Navbar;
