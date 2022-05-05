import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";

import "./styles.css";

const defaultValues = {
  allowance: null,
};

const Allowance = ({
  dealerAllowance,
  setShowLoader,
  web3,
  contract,
  accounts,
}) => {
  const [formValues, setFormValues] = useState(defaultValues);
  const [showForm, setShowForm] = useState(false);

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
    try {
      await contract.methods
        .approveDealer(parseInt(formValues.allowance))
        .send({ from: accounts[0] });
    } finally {
      setShowLoader(false);
      window.location.href = "/dashboard";
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  if (JSON.parse(sessionStorage.getItem("USER_DETAILS"))[0] == "") {
    window.location.href = "/register";
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        Current Allowance: &nbsp; <b>{dealerAllowance} FRONT</b>
        &nbsp;
        <EditIcon onClick={toggleForm} className="edit-icon" />
      </div>

      <br />
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="add-allowance-form"
          autoComplete={"off"}
        >
          <TextField
            id="allowance-input"
            name="allowance"
            label=""
            placeholder="New Allowance"
            type="number"
            variant="outlined"
            onChange={handleInputChange}
            className="textField"
            value={formValues.allowance}
            required
          />
          <Button variant="contained" color="default" type="submit">
            Approve
          </Button>
        </form>
      )}
    </div>
  );
};

export default Allowance;
