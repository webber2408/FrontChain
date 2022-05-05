import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { TextareaAutosize, TextField } from "@material-ui/core";
import uuid from "react-uuid";
import axios from "axios";

const defaultValues = {
  name: "",
  description: "",
  html: "",
  css: "",
  js: "",
  price: null,
};

const AddComponent = ({ web3, contract, accounts, setShowLoader }) => {
  const [formValues, setFormValues] = useState(defaultValues);

  if (JSON.parse(sessionStorage.getItem("USER_DETAILS"))[0] == "") {
    window.location.href = "/register";
  }

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
      const newComponent = {
        ...formValues,
        componentId: uuid(),
      };
      // SAVE TO LOCAL JSON
      await axios
        .post(`http://localhost:8081/update-json`, newComponent, {
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:8081",
            "cache-control": "no-cache",
          },
        })
        .then((res) => {
          console.log(res);
        });

      // SAVE TO BLOCKCHAIN
      await contract.methods
        .publishComponent(
          newComponent.name,
          newComponent.componentId,
          parseInt(newComponent.price),
          newComponent.description
        )
        .send({ from: accounts[0] });

      setFormValues(defaultValues);
    } finally {
      setShowLoader(false);
      window.location.href = "/dashboard";
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} autoComplete={"off"}>
        <br />
        <br />
        <div className="form-labels">Component Name</div>
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
        <div className="form-labels">Description</div>
        <TextField
          id="description-input"
          name="description"
          label=""
          type="text"
          variant="outlined"
          onChange={handleInputChange}
          className="textField"
          value={formValues.description}
          required
        />
        <br />
        <br />
        <div className="form-labels">HTML Code</div>
        <TextareaAutosize
          placeholder="Enter HTML here!"
          minRows={10}
          name="html"
          style={{ width: "422px" }}
          onChange={handleInputChange}
          value={formValues.html}
        />
        <br />
        <br />
        <div className="form-labels">CSS Code</div>
        <TextareaAutosize
          placeholder="Enter CSS here!"
          minRows={10}
          name="css"
          style={{ width: "422px" }}
          onChange={handleInputChange}
          value={formValues.css}
        />
        <br />
        <br />
        <div className="form-labels">JS Code</div>
        <TextareaAutosize
          placeholder="Enter JS here!"
          minRows={10}
          name="js"
          style={{ width: "422px" }}
          onChange={handleInputChange}
          value={formValues.js}
        />
        <br />
        <br />
        <div className="form-labels">Price (in FRONT)</div>
        <TextField
          id="price-input"
          name="price"
          label=""
          type="number"
          variant="outlined"
          onChange={handleInputChange}
          value={formValues.price}
          required
        />
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

export default AddComponent;
