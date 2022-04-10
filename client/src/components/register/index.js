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
  balance: null,
};

const getConvertedUserType = (userType) => {
  switch (userType) {
    case "seller":
      return 0;
    case "buyer":
      return 1;
  }
};

const Register = ({ web3, contract, accounts }) => {
  const [formValues, setFormValues] = useState(defaultValues);

  const handleInputChange = (e, customName = "") => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [customName || name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newUser = {
      ...formValues,
      userType: getConvertedUserType(formValues.userType),
      userId: uuid(),
    };
    console.log("NEW USER => ", newUser);
    try {
      const response = await contract.methods
        .registerUser(newUser.name, newUser.userId, newUser.userType)
        .send({ from: accounts[0], value: parseInt(newUser.balance) });
      console.log(response);
    } catch (err) {
      console.error("Error registering the user => ", newUser, err);
    }
  };

  const runExample = async () => {
    // register seller
    // const response = await contract.methods
    //   .registerUser("rahul", "u1", 0)
    //   .send({ from: accounts[0], value: 1 });
    // console.log(response);
    // publish component
    // const response = await contract.methods
    //   .publishComponent("input", "c1", 4)
    //   .send({ from: accounts[0] });
    // console.log(response);
    // register buyer
    // const response = await contract.methods
    //   .registerUser("buyer1", "u2", 1)
    //   .send({ from: accounts[0], value: 100 });
    // console.log(response);
    // get all components
    // const response = await contract.methods.getAllComponents().call();
    // console.log(response);
    // get owner details - temporary permission for Buyer
    // const response = await contract.methods.getOwnerDetails("c1").call();
    // console.log(response);
    // get component details
    // const response = await contract.methods.getComponentDetails("c1").call();
    // console.log(response);
    // purchase component
    // const response = await contract.methods
    //   .purchaseComponent("c1")
    //   .send({ from: accounts[0] });
    // console.log(response);
    // get owner details - temporary permission for Buyer
    // const response = await contract.methods.getOwnerDetails("c1").call();
    // console.log(response);
    // Update state with the result.
    // this.setState({ storageValue: response });
  };

  return (
    <div className="register">
      <h4>Hi {accounts && accounts[0]} !</h4>
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
        <br />
        <br />
        <div className="form-labels">Starting Balance (in Wei)</div>
        <TextField
          id="balance-input"
          name="balance"
          label=""
          type="number"
          variant="outlined"
          onChange={handleInputChange}
          value={formValues.balance}
          required
        />
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
            <FormControlLabel value="buyer" control={<Radio />} label="Buyer" />
            <FormControlLabel
              value="seller"
              control={<Radio />}
              label="Seller"
            />
          </RadioGroup>
        </FormControl>
        <br />
        <br />
        <div className="btn-wrapper">
          <Button variant="outlined" color="primary" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Register;
