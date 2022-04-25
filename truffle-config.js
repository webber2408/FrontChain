const path = require("path");

const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          "borrow general describe torch space social stairs pumpkin depend model sound question",
          // "https://ropsten.infura.io/v3/b5b1c35116f1438294087b6be09bf47a"
          "https://ropsten.infura.io/v3/4532868dacdd4d81b7eb62fa550091b3"
          // "https://eth-ropsten.alchemyapi.io/v2/vJeDCf9CvsIGXg8EWK-A1VvJVFpW864I"
        ),
      network_id: 3,
      // chainId: 3,
      // gas: 4000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.12",
    },
  },
};
