import React, { useEffect, useState } from "react";
import Allowance from "./allowance";
import ComponentCard from "./card";

const Dashboard = ({ web3, contract, accounts, setShowLoader }) => {
  const [components, setComponents] = useState([]);
  const [currentUserUUID, setCurrentUserUUID] = useState(null);
  const [dealerAllowance, setDealerAllowance] = useState(null);

  if (JSON.parse(sessionStorage.getItem("USER_DETAILS"))[0] == "") {
    window.location.href = "/register";
  }

  const getDealerAllowance = async () => {
    const response = await contract.methods
      .getDealerAllowance(accounts[0])
      .call({
        from: accounts[0],
      });
    setDealerAllowance(response);
  };

  const getAllComponents = async () => {
    const response = await contract.methods.getAllComponents().call({
      from: accounts[0],
    });
    const currentUser = await contract.methods.getUser().call({
      from: accounts[0],
    });
    if (currentUser) setCurrentUserUUID(currentUser[1]);
    setComponents(response);
  };

  useEffect(() => {
    if (contract) {
      getAllComponents();
      getDealerAllowance();
    }
  }, [contract]);

  return (
    <>
      <Allowance
        dealerAllowance={dealerAllowance}
        setShowLoader={setShowLoader}
        web3={web3}
        accounts={accounts}
        contract={contract}
      />
      <br />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {components &&
          components.map((item) => {
            return (
              <ComponentCard
                name={item[0]}
                price={item[2]}
                cid={item[1]}
                description={item[5]}
                web3={web3}
                accounts={accounts}
                contract={contract}
                isOwned={item[4] == currentUserUUID}
                setShowLoader={setShowLoader}
                dealerAllowance={dealerAllowance}
              />
            );
          })}
      </div>
    </>
  );
};

export default Dashboard;
