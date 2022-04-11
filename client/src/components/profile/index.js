import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import AccountBox from "@material-ui/icons/AccountBox";

const getUserType = (userType) => {
  switch (userType) {
    case "0":
      return "Seller";
    case "1":
      return "Buyer";
  }
};

const Profile = ({ contract }) => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    setUserDetails(JSON.parse(sessionStorage.getItem("USER_DETAILS")));
  }, [contract]);

  if (JSON.parse(sessionStorage.getItem("USER_DETAILS"))[0] == "") {
    window.location.href = "/register";
  }

  if (!userDetails) return <></>;

  if (!userDetails[0])
    return (
      <>
        <h4>You are not registered yet!</h4>
      </>
    );

  return (
    <div className="profile">
      <List>
        <ListItem>
          <ListItemAvatar>
            <AccountBox />
          </ListItemAvatar>
          <ListItemText primary="Name" secondary={userDetails[0]} />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <AccountBox />
          </ListItemAvatar>
          <ListItemText primary="Address" secondary={userDetails[1]} />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <AccountBox />
          </ListItemAvatar>
          <ListItemText primary="Balance" secondary={userDetails[2] + " Wei"} />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <AccountBox />
          </ListItemAvatar>
          <ListItemText
            primary="User Type"
            secondary={getUserType(userDetails[3])}
          />
        </ListItem>
      </List>
    </div>
  );
};

export default Profile;
