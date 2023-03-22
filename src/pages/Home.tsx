import React, { useRef } from "react";
import {
  herosOf,
  totalSupply,
  fetchAccount,
} from "../components/contractWeb3";
import { useCallback, useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import RPC from "../web3RPC";
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";
import {
  WalletConnectV2Adapter,
  getWalletConnectV2Settings,
} from "@web3auth/wallet-connect-v2-adapter";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";
import { useNavigate } from "react-router-dom";
const clientId =
  "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk";

function Home() {

  const [supply, setSupply] = React.useState<number>(0);
  const [balance, setBalance] = React.useState<number[]>([]);
  const [account, setAccount] = React.useState<string>("");
const navigate = useNavigate();




  const memoizedFetchBalance = useCallback(async () => {
    setBalance(await herosOf(account));
  }, [account]);

  React.useEffect(() => {
    const accountSet = async () => {
      setAccount(await fetchAccount());
    };
    const nftNumber = async () => {
      setSupply(await totalSupply());
    };
    accountSet();
    nftNumber();
    memoizedFetchBalance();

  }, [account, balance, memoizedFetchBalance]);



  // HEADER

  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [userWallet, setUserWallet] = useState<string | null>("");
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [torusPlugin, setTorusPlugin] =
    useState<TorusWalletConnectorPlugin | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x13881", // Mumbai Polygon Testnet Chain ID
            rpcTarget: "https://rpc-mumbai.maticvigil.com", // Mumbai Polygon Testnet RPC URL
          },
          uiConfig: {
            theme: "dark",
            loginMethodsOrder: ["github", "google"],
            defaultLanguage: "en",
            appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
          },
          web3AuthNetwork: "cyan",
        });

        const openloginAdapter = new OpenloginAdapter({
          loginSettings: {
            mfaLevel: "default",
          },
          adapterSettings: {
            whiteLabel: {
              name: "Premir NFTs",
              logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
              logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
              defaultLanguage: "en",
              dark: true,
            },
          },
        });
        web3auth.configureAdapter(openloginAdapter);

        const torusPlugin = new TorusWalletConnectorPlugin({
          torusWalletOpts: {},
          walletInitOptions: {
            whiteLabel: {
              theme: { isDark: true, colors: { primary: "#00a8ff" } },
              logoDark: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
              logoLight: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
            },
            useWalletConnect: true,
            enableLogging: true,
          },
        });
        setTorusPlugin(torusPlugin);
        await web3auth.addPlugin(torusPlugin);

        // adding wallet connect v2 adapter
        const defaultWcSettings = await getWalletConnectV2Settings(
          "eip155",
          [1, 137, 5],
          "04309ed1007e77d1f119b85205bb779d"
        );
        const walletConnectV2Adapter = new WalletConnectV2Adapter({
          adapterSettings: { ...defaultWcSettings.adapterSettings },
          loginSettings: { ...defaultWcSettings.loginSettings },
        });

        web3auth.configureAdapter(walletConnectV2Adapter);

        // adding metamask adapter
        const metamaskAdapter = new MetamaskAdapter({
          clientId,
          sessionTime: 3600,
          web3AuthNetwork: "cyan",
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x13881",
            rpcTarget: "https://rpc-mumbai.maticvigil.com",
          },
        });
        // we can change the above settings using this function
        metamaskAdapter.setAdapterSettings({
          sessionTime: 86400, // 1 day in seconds
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x13881",
            rpcTarget: "https://rpc-mumbai.maticvigil.com",
          },
          web3AuthNetwork: "cyan",
        });

        web3auth.configureAdapter(metamaskAdapter);

        const torusWalletAdapter = new TorusWalletAdapter({
          clientId,
        });

        web3auth.configureAdapter(torusWalletAdapter);

        setWeb3auth(web3auth);

        await web3auth.initModal();
        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    uiConsole("Logged in Successfully!");
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const showWCM = async () => {
    if (!torusPlugin) {
      uiConsole("torus plugin not initialized yet");
      return;
    }
    torusPlugin.showWalletConnectScanner();
    uiConsole();
  };

  const initiateTopUp = async () => {
    if (!torusPlugin) {
      uiConsole("torus plugin not initialized yet");
      return;
    }
    torusPlugin.initiateTopup("moonpay", {
      selectedAddress: "0x8cFa648eBfD5736127BbaBd1d3cAe221B45AB9AF",
      selectedCurrency: "USD",
      fiatValue: 100,
      selectedCryptoCurrency: "ETH",
      chainNetwork: "mainnet",
    });
  };

  const getChainId = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    uiConsole(chainId);
  };

  const addChain = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const newChain = {
      chainId: "0x5",
      displayName: "Goerli",
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      tickerName: "Goerli",
      ticker: "ETH",
      decimals: 18,
      rpcTarget: "https://rpc.ankr.com/eth_goerli",
      blockExplorer: "https://goerli.etherscan.io",
    };
    await web3auth?.addChain(newChain);
    uiConsole("New Chain Added");
  };

  const switchChain = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    await web3auth?.switchChain({ chainId: "0x5" });
    uiConsole("Chain Switched");
  };

  const getAccounts = useCallback(async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole(address);
    function sliceAddress(address: string): string {
      const prefix = address.slice(0, 6);
      const suffix = address.slice(-4);
      return `${prefix}...${suffix}`;
    }
    return sliceAddress(address[0]);
  }, [provider]);

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    uiConsole(privateKey);
  };

  // const changeNetwork = async () => {
  //   if (!provider) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const privateKey = await rpc.getPrivateKey();
  //   uiConsole(privateKey);
  // };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  useEffect(() => {
    const fetchUserWallet = async () => {
      const userW = await getAccounts();
      console.log("userWWW", userW);
      const wallet = userW ? userW : "";
      setUserWallet(wallet);
    };
    fetchUserWallet();
  }, [getAccounts, userWallet]);

  const unloggedInView = (
    <div className="bg-red-600 hover:bg-red-500 rounded-xl transition-all">
      <button
        onClick={login}
        className=" border-2 border-red-600 rounded-xl py-3 px-6 font-bold text-transparent text-lg bg-clip-text bg-gradient-to-r from-slate-100 to-yellow-300 shadow-lg"
      >
        Login
      </button>
    </div>
  );

  const loggedInView = (
    <div className="flex drop-shadow-lg">
      {showMenu ? (
        <div className="bg-red-600 hover:bg-red-500 rounded-xl transition-all overflow-hidden mr-4">
          <button
            onClick={() => {
              setShowMenu(false);
              logout();
            }}
            className=" border-2 border-red-600 rounded-xl py-3 px-6 font-bold text-transparent text-md bg-clip-text bg-gradient-to-r from-slate-100 to-yellow-300"
          >
            LogOut
          </button>{" "}
        </div>
      ) : (
        ""
      )}

      <div className="bg-red-700 hover:bg-red-500 rounded-xl transition-all overflow-hidden">
        {showMenu ? (
          <button
            onClick={() => setShowMenu(false)}
            className=" border-2 border-red-600 rounded-xl py-3 px-6 font-bold text-transparent text-md bg-clip-text bg-gradient-to-r from-slate-100 to-yellow-200"
          >
            {userWallet}
          </button>
        ) : (
          <button
            onClick={() => setShowMenu(true)}
            className=" border-2 border-red-600 rounded-xl py-3 px-6 font-bold text-transparent text-md bg-clip-text bg-gradient-to-r from-slate-100 to-yellow-200"
          >
            {userWallet}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen justify-between">
      <div>
        <div className="flex justify-between px-10 py-4 bg-[#F2387C] overflow-hidden p-6">
          <div className="flex items-center">
            <img
              onClick={() => {
                window.location.href = "/";
              }}
              src="/premier.jpg"
              alt="Premier League Logo"
              className="w-10 cursor-pointer"
            />
            <button
              className="flex font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-slate-100 to-yellow-200 s"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              PREMIER NFTs
            </button>
          </div>

          <div className="flex items-center">
            {provider ? loggedInView : unloggedInView}
          </div>
        </div>
      </div>

      <main className="mb-auto">
        <div className="relative h-[18rem]">
          <img
            src="/Field.png"
            className="absolute h-full w-full z-0"
            alt="Hero"
          />
          <div className="flex items-center justify-center">
            <div className="grid transform z-10 pt-10">
              <h1 className="text-4xl font-bold text-black shadow-lg mb-8 w-96 text-center p-4 bg-white rounded-xl">
                Mint your Favorite <br />
                Footballers
                <br />
                <div className="text-sm">Players left - {10000 - supply}</div>
              </h1>
              <button
                className="px-10 py-3 b-2 rounded-xl bg-red-600 hover:bg-red-500 transition-all text-white text-2xl shadow-lg"
                onClick={() => navigate("/mint")}
              >
                Go to MINT Page
              </button>
            </div>
          </div>
          <div className="bg-slate-300 text-6xl font-bold mt-6 p-6 text-center">
            PLAY AND TRADE
          </div>
          <div className="px-24 py-12 text-2xl bg-slate-200">
            Welcome to the ultimate Premier League Football NFT Game! Immerse
            yourself in the exhilarating world of football by minting,
            collecting, and trading your favorite Premier League players in the
            form of Non-Fungible Tokens (NFTs). Our innovative and user-friendly
            platform offers an unparalleled experience for both avid football
            fans and NFT enthusiasts alike, providing an interactive and
            engaging way to connect with the sport you love. In our
            groundbreaking game, you'll have the chance to mint unique Premier
            League player NFTs, showcasing the star players from all 20 clubs.
            Each NFT is a digital collectible that represents a player's in-game
            attributes, individuality, and accomplishments. With our
            state-of-the-art blockchain technology, you can rest assured that
            your collection is secure, verifiable, and truly one-of-a-kind.
            Unleash your strategic prowess as you build and customize your dream
            team, showcasing your football knowledge and acumen. Engage in
            thrilling player trades with fellow enthusiasts, participate in
            special events, and climb the ranks to become the ultimate football
            NFT collector. Join us now and embark on an unforgettable journey
            into the world of Premier League Football NFTs, where passion for
            the beautiful game meets cutting-edge technology. Let's create
            history together!
          </div>
          <img
            src="/Field.png"
            className="h-full w-full z-0"
            alt="Hero"
          />
          
        </div>
      </main>
      <footer className="text-center text-xl font-semibold bg-slate-100 p-4">
        THIS IS A GAMEON TEST
      </footer>
    </div>
  );
}

export default Home;
