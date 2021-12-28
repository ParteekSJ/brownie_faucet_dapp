import { useEffect, useState, useCallback } from "react";
import map from "./artifacts/deployments/map.json";
import FaucetArtifact from "./artifacts/contracts/Faucet.json";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import InstallMetamask from "./components/InstallMetamask";

export default function App() {
  const address = map[1337]["Faucet"][0];
  const faucetABI = FaucetArtifact.abi;
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    contract: null,
    isProviderLoaded: false,
    chainId: null,
  });

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [shouldReload, reload] = useState(false);

  // Toggles whether to reload component or not
  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload]);

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const setAccountListener = (provider) => {
    // realtime Metamask event listeners
    // provider.on("accountsChanged", (accounts) => setAccount(accounts[0]));
    provider.on("accountsChanged", (_) => window.location.reload());
    provider.on("chainChanged", (_) => window.location.reload());
  };

  useEffect(() => {
    const loadProvider = async () => {
      console.log("1");
      let detectProvider = await detectEthereumProvider();

      if (detectProvider) {
        setAccountListener(detectProvider); // metamask provider listening for events
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const { chainId } = await provider.getNetwork();
        const contract = new ethers.Contract(address, faucetABI, provider);
        setWeb3Api({
          provider,
          contract,
          isProviderLoaded: true,
          chainId,
        });
      } else {
        console.log("Please install metamask");
        setWeb3Api((api) => ({ ...api, isProviderLoaded: true }));
      }
    };

    loadProvider();
  }, []);

  useEffect(() => {
    const getAccounts = async () => {
      try {
        const accounts = await web3Api.provider.getSigner().getAddress();
        console.log("2");
        setAccount(accounts);
      } catch (e) {
        console.log("getAccounts() error => ", e.message);
      }
    };

    // Will only run once the ETHERS.JS provider is loaded.
    web3Api.provider && getAccounts();
  }, [web3Api.provider]);

  useEffect(() => {
    const loadBalance = async () => {
      console.log(3);
      const balance = await web3Api.provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
    };

    // Will only run once the contract is loaded.
    web3Api.contract && loadBalance();
  }, [web3Api, shouldReload]);

  // changes the function only when web3Api changes otherwise uses the cached version
  const addFunds = useCallback(async () => {
    const signer = await web3Api.provider.getSigner();
    const FaucetContract = new ethers.Contract(address, faucetABI, signer);
    const tX = await FaucetContract.addFunds({
      from: signer.getAddress(),
      value: "1000000000000000000",
    });

    await tX.wait();
    reloadEffect();
  }, [web3Api, reloadEffect]);

  const withdrawEth = async () => {
    const signer = await web3Api.provider.getSigner();
    const FaucetContract = new ethers.Contract(address, faucetABI, signer);
    const tX = await FaucetContract.withdrawFunds(500000000000000000n, {
      from: signer.getAddress(),
    });
    await tX.wait();
    reloadEffect();
  };

  return (
    <>
      {window.ethereum && window.ethereum.isMetaMask ? (
        <div className="h-full flex justify-center items-center bg-slate-50">
          <div>
            {web3Api.chainId !== 1337 ? (
              <div className=" transition-all text-gray-500 flex">
                <p className=" mr-1">Wrong Network.</p>
                <p className="font-semibold text-gray-800 ">
                  Switch to Ganache Network
                </p>
              </div>
            ) : (
              <div>
                <span className="mr-2">Account:</span>
                {account ? (
                  account
                ) : (
                  <button
                    onClick={async () => {
                      await web3Api.provider.send("eth_requestAccounts", []);
                    }}
                    className="connectButton"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            )}

            <div className="text-[36px] font-normal">
              Current Balance - <strong>{balance}</strong> ETH
            </div>
            <div className="flex ">
              <button
                disabled={!account || web3Api.chainId !== 1337}
                onClick={addFunds}
                className="actionButton bg-green-200 hover:bg-green-500 text-green-500 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-600"
              >
                Donate 1 ETH
              </button>
              <button
                disabled={!account || web3Api.chainId != 1337}
                onClick={withdrawEth}
                className="actionButton bg-red-200 hover:bg-red-500  text-red-500 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-600"
              >
                Withdraw 0.5 ETH
              </button>
            </div>
          </div>
        </div>
      ) : (
        <InstallMetamask />
      )}
      )
    </>
  );
}
