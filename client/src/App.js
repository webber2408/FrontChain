import React, { useState, useEffect } from "react";
import FrontChainContract from "./contracts/FrontChain.json";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import Profile from "./components/profile";
import AddComponent from "./components/addComponent";
import getWeb3 from "./getWeb3";

import "./App.css";
import Requests from "./components/requests";
import Loader from "./components/loader";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [isCeo, setIsCeo] = useState(false);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const connectWeb3 = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log("ACCOUNTS", accounts);

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
      console.log("RESPONSE", response);
      sessionStorage.setItem("USER_DETAILS", JSON.stringify(response));

      const ceoResponse = await instance.methods.isUserCeo().call({
        from: accounts[0],
      });
      console.log(ceoResponse);
      setIsCeo(ceoResponse);

      // Set web3, accounts, and contract to the state
      setWeb3(web3);
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

  const currentUser = JSON.parse(sessionStorage.getItem("USER_DETAILS"));
  const pathName = window.location.pathname;

  return (
    <div className="App">
      {showLoader && <Loader />}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <h2>FrontChain |</h2>
          <h6 style={{ marginTop: "28px", marginLeft: "10px" }}>
            Where Frontend meets Blockchain!
          </h6>
        </div>
        <div className="nav-btns">
          <Button
            variant={
              pathName == "/register" || pathName == "/"
                ? "contained"
                : "default"
            }
            color="primary"
            onClick={() => {
              window.location.href = "/register";
            }}
          >
            Register
          </Button>
          {currentUser && currentUser[0] != "" && (
            <>
              <Button
                variant={pathName == "/dashboard" ? "contained" : "default"}
                color="primary"
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
              >
                Dashboard
              </Button>

              <Button
                variant={pathName == "/profile" ? "contained" : "default"}
                color="primary"
                onClick={() => {
                  getUserDetails(() => {
                    window.location.href = "/profile";
                  });
                }}
              >
                Profile
              </Button>

              {currentUser[3] == "0" && (
                <Button
                  variant={
                    pathName == "/add-component" ? "contained" : "default"
                  }
                  color="primary"
                  onClick={() => {
                    window.location.href = "/add-component";
                  }}
                >
                  Add Component
                </Button>
              )}

              <Button
                variant={pathName == "/requests" ? "contained" : "default"}
                color="primary"
                onClick={() => {
                  window.location.href = "/requests";
                }}
              >
                Feature Requests
              </Button>

              {/* <Button
                variant={"default"}
                color="primary"
                onClick={() => {
                  window.location.href = "/profile";
                }}
              >
                Link Metamask
              </Button> */}
            </>
          )}
        </div>
      </div>
      <hr />
      <Router>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <Register
                web3={web3}
                contract={contract}
                accounts={accounts}
                setShowLoader={setShowLoader}
                isCeo={isCeo}
              />
            }
          />
          <Route
            path="/register"
            exact
            element={
              <Register
                web3={web3}
                contract={contract}
                accounts={accounts}
                setShowLoader={setShowLoader}
                isCeo={isCeo}
              />
            }
          />
          <Route
            path="/dashboard"
            exact
            element={
              <Dashboard
                web3={web3}
                contract={contract}
                accounts={accounts}
                setShowLoader={setShowLoader}
              />
            }
          />
          <Route
            path="/profile"
            exact
            element={
              <Profile
                web3={web3}
                contract={contract}
                accounts={accounts}
                setShowLoader={setShowLoader}
              />
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
                setShowLoader={setShowLoader}
              />
            }
          />
          <Route
            path="/requests"
            exact
            element={
              <Requests
                web3={web3}
                contract={contract}
                accounts={accounts}
                setShowLoader={setShowLoader}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
