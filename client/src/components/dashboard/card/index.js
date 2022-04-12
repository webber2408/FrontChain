import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { getParameters } from "codesandbox/lib/api/define";
import axios from "axios";

const useStyles = makeStyles({
  root: {
    width: 320,
    margin: 20,
    position: "relative",
  },
  rootOwned: {
    width: 320,
    margin: 20,
    backgroundColor: "#e7ffe7",
    position: "relative",
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

const ComponentCard = ({
  name,
  price,
  cid,
  description,
  web3,
  contract,
  accounts,
  isOwned,
}) => {
  const [ownerName, setOwnerName] = useState(null);
  const [ownerAddress, setOwnerAddress] = useState(null);
  const [codeFiles, setCodeFiles] = useState(null);
  const [showDemo, setShowDemo] = useState(false);
  const classes = useStyles();

  const onViewOwner = async (cid) => {
    if (ownerName) {
      setOwnerName(null);
      setOwnerAddress(null);
      return;
    }
    const response = await contract.methods.getOwnerDetails(cid).call({
      from: accounts[0],
    });
    setOwnerName(response[1][0]);
    setOwnerAddress(response[1][1]);
  };

  const buyComponent = async (cid) => {
    await contract.methods.purchaseComponent(cid).send({ from: accounts[0] });
    window.location.href = "/dashboard";
  };

  const onUnlock = async (cid) => {
    if (codeFiles) {
      setCodeFiles(null);
      return;
    }
    await axios
      .get(`http://localhost:8081/get-component?cid=${cid}`, {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:8081",
          "cache-control": "no-cache",
        },
      })
      .then(({ data }) => {
        if (!data) return;
        setCodeFiles(
          getParameters({
            files: {
              "index.html": {
                content: `${data.html}`,
              },
              "index.css": {
                content: `${data.css}`,
              },
              "index.js": {
                content: `${data.js}`,
              },
            },
          })
        );
        setShowDemo(true);
      });
  };

  return (
    <>
      <Card className={isOwned ? classes.rootOwned : classes.root}>
        {isOwned && (
          <div
            style={{
              color: "green",
              fontWeight: "700",
              position: "absolute",
              right: "10px",
              top: "10px",
            }}
          >
            OWNED
          </div>
        )}

        <CardContent>
          <h1 className={classes.title}>{name}</h1>
          <h5>{description}</h5>
          <h4>{price} Wei</h4>
        </CardContent>
        <CardActions>
          {!isOwned ? (
            <>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => buyComponent(cid)}
              >
                Buy
              </Button>
              <Button variant="outlined" onClick={() => onViewOwner(cid)}>
                {ownerName ? "Hide" : "View"} Owner
              </Button>
            </>
          ) : (
            <>
              <Button variant="outlined" onClick={() => onUnlock(cid)}>
                {codeFiles ? "Lock" : "Unlock"} Sanbox
              </Button>
              {showDemo && codeFiles && (
                <form
                  action="https://codesandbox.io/api/v1/sandboxes/define"
                  method="POST"
                  target="_blank"
                >
                  <input type="hidden" name="parameters" value={codeFiles} />
                  <Button type="submit" color="secondary">
                    Open
                  </Button>
                </form>
              )}
            </>
          )}
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
    </>
  );
};

export default ComponentCard;
