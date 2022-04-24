import { CircularProgress } from "@material-ui/core";
import React from "react";

import "./loader.css";

const Loader = () => {
  return (
    <div className="loaderWrapper">
      <CircularProgress />
      <br />
      <div>Transacting ...</div>
      <br />
      <div>Patience is bitter, but its fruit is sweet!</div>
    </div>
  );
};

export default Loader;
