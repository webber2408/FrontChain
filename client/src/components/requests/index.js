import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import uuid from "react-uuid";
import Moment from "react-moment";
import Paper from "@material-ui/core/Paper";
import DescriptionIcon from "@material-ui/icons/Description";

import "./requests.css";

const defaultValues = {
  description: "",
};
const dateOptions = {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
};

const Requests = ({ web3, contract, accounts, setShowLoader }) => {
  const [formValues, setFormValues] = useState(defaultValues);
  const [showAddForm, setShowAddForm] = useState(false);
  const [requests, setRequests] = useState(null);

  const getAlRequests = async () => {
    const response = await contract.methods.getAllRequests().call({
      from: accounts[0],
    });
    setRequests([...response].reverse());
  };

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

    const newRequest = {
      ...formValues,
      reqId: uuid(),
      timestamp: new Date().toLocaleDateString("en-US", dateOptions),
    };

    // SAVE TO BLOCKCHAIN
    await contract.methods
      .addRequest(
        newRequest.description,
        newRequest.reqId,
        newRequest.timestamp
      )
      .send({ from: accounts[0] });

    setFormValues(defaultValues);
    setShowAddForm(false);
    getAlRequests();
    setShowLoader(false);
  };

  const toggleForm = () => {
    setShowAddForm(!showAddForm);
  };

  if (JSON.parse(sessionStorage.getItem("USER_DETAILS"))[0] == "") {
    window.location.href = "/register";
  }

  useEffect(() => {
    if (contract) getAlRequests();
  }, [contract]);

  return (
    <div className="requests">
      <div className="requests-header">
        <h3>Component Requests</h3>
        <Button variant="contained" color="primary" onClick={toggleForm}>
          {showAddForm ? "-" : "+"}
        </Button>
      </div>
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="add-request-form"
          autoComplete={"off"}
        >
          <TextField
            id="description-input"
            name="description"
            label=""
            placeholder="Request Description Here...."
            type="text"
            variant="outlined"
            onChange={handleInputChange}
            className="textField"
            value={formValues.description}
            required
          />
          <Button variant="contained" color="default" type="submit">
            Send
          </Button>
        </form>
      )}
      {requests &&
        requests.map((item) => (
          <Paper className="paper" elevation={1}>
            <div className="paper_header">
              <DescriptionIcon /> &nbsp; Description
            </div>
            <div className="paper-text">
              <div>{item[0]}</div>
              <div>
                <i>Status: </i> {"  "}
                <span>
                  <b style={{ color: "green" }}>ACTIVE</b>
                </span>
                &nbsp; &nbsp;
                <i>Posted on:</i>
                {"  "}
                <Moment format="D MMM YYYY" withTitle>
                  {item[2]}
                </Moment>
              </div>
            </div>
          </Paper>
        ))}
    </div>
  );
};

export default Requests;
