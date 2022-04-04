var FrontChainMigrations = artifacts.require("./FrontChain.sol");

module.exports = function (deployer) {
  deployer.deploy(FrontChainMigrations);
};
