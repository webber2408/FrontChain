import React, { useEffect, useState } from "react";
import ComponentCard from "./card";

const Dashboard = ({ web3, contract, accounts }) => {
  const [components, setComponents] = useState([]);

  const getAllComponents = async () => {
    const response = await contract.methods.getAllComponents().call({
      from: accounts[0],
    });
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
              web3={web3}
              accounts={accounts}
              contract={contract}
            />
          );
        })}
    </div>
  );
};

export default Dashboard;
