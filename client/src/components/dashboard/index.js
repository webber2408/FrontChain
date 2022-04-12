import React, { useEffect, useState } from "react";
import ComponentCard from "./card";

const Dashboard = ({ web3, contract, accounts }) => {
  const [components, setComponents] = useState([]);
  const [currentUserUUID, setCurrentUserUUID] = useState(null);

  if (JSON.parse(sessionStorage.getItem("USER_DETAILS"))[0] == "") {
    window.location.href = "/register";
  }

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
    }
  }, [contract]);

  return (
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
            />
          );
        })}
    </div>
  );
};

export default Dashboard;
