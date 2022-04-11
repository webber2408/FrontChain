import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  root: {
    width: 250,
    margin: 20,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 34,
  },
  pos: {
    marginBottom: 12,
  },
});

const ComponentCard = ({ name, price, cid, web3, contract, accounts }) => {
  const [ownerName, setOwnerName] = useState(null);
  const [ownerAddress, setOwnerAddress] = useState(null);
  const classes = useStyles();

  const onViewOwner = async (cid) => {
    const response = await contract.methods.getOwnerDetails(cid).call({
      from: accounts[0],
    });
    setOwnerName(response[1][0]);
    setOwnerAddress(response[1][1]);
  };

  const buyComponent = async (cid) => {
    const response = await contract.methods
      .purchaseComponent(cid)
      .send({ from: accounts[0] });
    window.location.href = "/dashboard";
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <h1 className={classes.title}>{name}</h1>
        <h4>{price} ETH</h4>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => buyComponent(cid)}
        >
          Buy
        </Button>
        <Button variant="contained" onClick={() => onViewOwner(cid)}>
          View Owner
        </Button>
      </CardActions>
      {ownerName && (
        <div style={{ padding: "10px" }}>
          <b>Owned by:</b> <br />
          {ownerName}
          <br />
          {ownerAddress}
        </div>
      )}
    </Card>
  );
};

export default ComponentCard;
