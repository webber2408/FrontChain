import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import "./airdrop.css";

const defaultValues = {
  address: "",
  amount: null,
};

const Airdrop = ({ web3, contract, accounts, setShowLoader }) => {
  const [formValues, setFormValues] = useState(defaultValues);

  const handleInputChange = (e, customName = "") => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [customName || name]: value,
    });
  };

  const handleSubmit = async (event) => {
    setShowLoader(true);
    event.preventDefault();
    try {
      const values = {
        ...formValues,
        amount: parseInt(formValues.amount),
      };
      await contract.methods.airDrop(values.address, values.amount).send({
        from: accounts[0],
      });
    } finally {
      setShowLoader(false);
      window.location.href = "/profile";
    }
  };

  if (JSON.parse(sessionStorage.getItem("USER_DETAILS"))[0] == "") {
    window.location.href = "/register";
  }

  return (
    <div className="airdrop">
      <div className="airdrop-header">
        <h3>Airdrop</h3>
      </div>
      <form
        onSubmit={handleSubmit}
        className="add-airdrop-form"
        autoComplete={"off"}
      >
        <TextField
          id="address-input"
          name="address"
          label=""
          placeholder="Airdrop Address...."
          type="text"
          variant="outlined"
          onChange={handleInputChange}
          className="textField"
          value={formValues.address}
          required
        />
        <TextField
          id="amount-input"
          name="amount"
          label=""
          type="number"
          variant="outlined"
          onChange={handleInputChange}
          className="textField"
          placeholder="Amount (FRONT Coins)"
          value={formValues.amount}
          required
        />
        <Button variant="contained" color="default" type="submit">
          DROP
        </Button>
      </form>
    </div>
  );
};

export default Airdrop;
