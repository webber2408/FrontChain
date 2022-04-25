var FrontChainMigrations = artifacts.require("./FrontChain.sol");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(FrontChainMigrations);
};
