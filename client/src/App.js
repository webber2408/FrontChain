import React, { useState, useEffect } from "react";
import FrontChainContract from "./contracts/FrontChain.json";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import Profile from "./components/profile";
import getWeb3 from "./getWeb3";

import "./App.css";
import AddComponent from "./components/addComponent";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const connectWeb3 = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FrontChainContract.networks[networkId];
      const instance = new web3.eth.Contract(
        FrontChainContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      const response = await instance.methods.getUser().call({
        from: accounts[0],
      });
      sessionStorage.setItem("USER_DETAILS", JSON.stringify(response));
      setUserDetails(response);

      // Set web3, accounts, and contract to the state
      setWeb3(web3);
      console.log(accounts);
      setAccounts(accounts);
      setContract(instance);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  const getUserDetails = async (callback) => {
    const response = await contract.methods.getUser().call({
      from: accounts[0],
    });
    sessionStorage.setItem("USER_DETAILS", JSON.stringify(response));
    callback();
  };

  useEffect(() => {
    connectWeb3();
  }, []);

  return (
    <div className="App">
      <div>
        <h2>FrontChain</h2>
        <div className="nav-btns">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              window.location.href = "/register";
            }}
          >
            Register
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Dashboard
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              getUserDetails(() => {
                window.location.href = "/profile";
              });
            }}
          >
            Profile
          </Button>

          {userDetails && userDetails[3] == "0" && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                window.location.href = "/add-component";
              }}
            >
              Add Component
            </Button>
          )}
        </div>
      </div>
      <hr />
      <Router>
        <Routes>
          <Route
            path="/register"
            exact
            element={
              <Register web3={web3} contract={contract} accounts={accounts} />
            }
          />
          <Route
            path="/dashboard"
            exact
            element={
              <Dashboard web3={web3} contract={contract} accounts={accounts} />
            }
          />
          <Route
            path="/profile"
            exact
            element={
              <Profile web3={web3} contract={contract} accounts={accounts} />
            }
          />
          <Route
            path="/add-component"
            exact
            element={
              <AddComponent
                web3={web3}
                contract={contract}
                accounts={accounts}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
