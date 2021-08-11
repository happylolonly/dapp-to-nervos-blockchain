import Web3 from "web3";
import { PolyjuiceHttpProvider } from "@polyjuice-provider/web3";

export const CONFIG = {
  WEB3_PROVIDER_URL: "http://godwoken-testnet-web3-rpc.ckbapp.dev",
  ROLLUP_TYPE_HASH:
    "0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a",
  ETH_ACCOUNT_LOCK_CODE_HASH:
    "0xdeec13a7b8e100579541384ccaf4b5223733e4a5483c3aec95ddc4c1d5ea5b22",
};

const godwokenRpcUrl = CONFIG.WEB3_PROVIDER_URL;
const providerConfig = {
  rollupTypeHash: CONFIG.ROLLUP_TYPE_HASH,
  ethAccountLockCodeHash: CONFIG.ETH_ACCOUNT_LOCK_CODE_HASH,
  web3Url: godwokenRpcUrl,
};

export async function createWeb3() {
  // Modern dapp browsers...
  if (window.ethereum) {
    const godwokenRpcUrl = CONFIG.WEB3_PROVIDER_URL;
    const providerConfig = {
      rollupTypeHash: CONFIG.ROLLUP_TYPE_HASH,
      ethAccountLockCodeHash: CONFIG.ETH_ACCOUNT_LOCK_CODE_HASH,
      web3Url: godwokenRpcUrl,
    };

    const provider = new PolyjuiceHttpProvider(godwokenRpcUrl, providerConfig);
    const web3 = new Web3(provider || Web3.givenProvider);

    try {
      // Request account access if needed
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
    }

    return web3;
  }

  console.log(
    "Non-Ethereum browser detected. You should consider trying MetaMask!"
  );
  return null;
}

const provider = new PolyjuiceHttpProvider(godwokenRpcUrl, providerConfig);

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        // const web3 = new Web3(window.ethereum);
        const web3 = new Web3(provider);
        try {
          // Request account access if needed
          await window.ethereum.enable();
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
          "http://127.0.0.1:7545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  });

export default getWeb3;
