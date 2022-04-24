import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // ROPSTEN
      // if (window.ethereum) {
      //   try {
      //     const provider = new Web3.providers.HttpProvider(
      //       "https://ropsten.infura.io/v3/b5b1c35116f1438294087b6be09bf47a"
      //     );
      //     const web3 = new Web3(provider);

      //     await window.ethereum.enable();
      //     console.log(web3);
      //     resolve(web3);
      //   } catch (error) {
      //     console.log("Connection error", error);
      //   }
      // }

      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          window.ethereum.on("accountsChanged", function (accounts) {
            window.location.href = "/profile";
          });
          // Accounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  });

export default getWeb3;
