import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import uuid from "react-uuid";

import "./register.css";

const defaultValues = {
  name: "",
  userType: "buyer",
  // balance: null,
};

const getConvertedUserType = (userType, isCeo) => {
  if (isCeo) {
    return 2;
  }
  switch (userType) {
    case "seller":
      return 0;
    case "buyer":
      return 1;
  }
};

const Register = ({ web3, contract, accounts, setShowLoader, isCeo }) => {
  const [formValues, setFormValues] = useState(defaultValues);

  // if (
  //   JSON.parse(sessionStorage.getItem("USER_DETAILS")) &&
  //   JSON.parse(sessionStorage.getItem("USER_DETAILS"))[0] != ""
  // ) {
  //   window.location.href = "/profile";
  // }

  const handleInputChange = (e, customName = "") => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [customName || name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowLoader(true);
    const newUser = {
      ...formValues,
      userType: getConvertedUserType(formValues.userType, isCeo),
      userId: uuid(),
    };
    try {
      console.log(accounts);
      await contract.methods
        .registerUser(newUser.name, newUser.userId, newUser.userType)
        .send({
          from: accounts[0],
          //value: parseInt(newUser.balance)
        });
      setShowLoader(false);
      window.location.href = "/profile";
    } catch (err) {
      console.error("Error registering the user => ", newUser, err);
    }
  };

  const currentUser = JSON.parse(sessionStorage.getItem("USER_DETAILS"));

  return (
    <div className="register">
      <h4>
        Hi {isCeo ? "(CEO) " : ""}
        {accounts && accounts[0]} !
      </h4>
      {currentUser && currentUser[0] == "" && currentUser[1] == "" && (
        <form onSubmit={handleSubmit} autoComplete={"off"}>
          <div className="form-labels">Name</div>
          <TextField
            id="name-input"
            name="name"
            label=""
            type="text"
            variant="outlined"
            onChange={handleInputChange}
            className="textField"
            value={formValues.name}
            required
          />
          {!isCeo && (
            <>
              <br />
              <br />
              <div className="form-labels">Starting Balance - 100 FRONT</div>
              <br />
              <br />
              <FormControl component="fieldset">
                <FormLabel component="legend">User Type</FormLabel>
                <RadioGroup
                  aria-label="userType"
                  name="userType"
                  value={formValues.userType}
                  onChange={(e) => handleInputChange(e, "userType")}
                >
                  <FormControlLabel
                    value="buyer"
                    control={<Radio />}
                    label="Buyer"
                  />
                  <FormControlLabel
                    value="seller"
                    control={<Radio />}
                    label="Seller"
                  />
                </RadioGroup>
              </FormControl>
            </>
          )}

          <br />
          <br />
          <div className="btn-wrapper">
            <Button variant="outlined" color="primary" type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}
      {currentUser && currentUser[0] != "" && currentUser[1] != "" && (
        <div>You are already registered!</div>
      )}
    </div>
  );
};

export default Register;
