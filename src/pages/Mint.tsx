import React, { useRef } from "react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Mousewheel,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { debounce } from "lodash";
import {
  createHerosPack,
  getHero,
  herosOf,
  Hero,
  createHeros,
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



function Mint() {
const clientId =
  "BI21cwkjkcxw0KjiLxEa1_r5bn4DA1gCvKYU9X1u-kSQB8ik-fFlpBoBfeQmSBEPVLiu5k_iBA9qKQXeHPQ9wnw";
  const [nfts, setNfts] = React.useState<Hero[]>([]);
  const [supply, setSupply] = React.useState<number>(0);
  const [balance, setBalance] = React.useState<number[]>([]);
  const [account, setAccount] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const price = 0.01;
  const handleSlideChange = debounce((event) => {
    console.log("Slide change");
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    // Handle the slide change event here
  }, 1000);

  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  const setNewNFTS = useCallback(async () => {
    let newArray = [];
    if (balance.length > 0) {
      setLoading(true);
      for (let i = 0; i < balance.length; i++) {
        const newHero = await getHero(balance[i]);
        newArray.push(newHero);
      }
      setNfts(newArray);
      setLoading(false);
    }
  }, [balance]);

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
    setNewNFTS();
  }, [account, balance, memoizedFetchBalance, setNewNFTS]);

  const isMobile =
    typeof window !== "undefined"
      ? window.innerWidth <= 768
        ? true
        : false
      : false;

  const isTablet =
    typeof window !== "undefined"
      ? window.innerWidth <= 1000 && window.innerWidth > 768
        ? true
        : false
      : false;

  const isWide =
    typeof window !== "undefined"
      ? window.innerWidth >= 1400 && window.innerWidth > 768
        ? true
        : false
      : false;
  function getImage(input: any) {
    const slic = input.slice(0, 1);
    const slice = slic[0];
    console.log("SLICE", slice);
    if (slice === "1" || slice === "2") {
      return "/manu.jpg";
    } else if (slice === "3" || slice === "4") {
      return "/liverpool.jpg";
    } else if (slice === "5" || slice === "6" || slice === "7") {
      return "/chelsea.jpg";
    } else {
      return "/mancity.jpg";
    }
  }

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
  // eslint-disable-next-line
  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };
  // eslint-disable-next-line
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
  // eslint-disable-next-line
  const showWCM = async () => {
    if (!torusPlugin) {
      uiConsole("torus plugin not initialized yet");
      return;
    }
    torusPlugin.showWalletConnectScanner();
    uiConsole();
  };
  // eslint-disable-next-line
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
  // eslint-disable-next-line
  const getChainId = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    uiConsole(chainId);
  };
  // eslint-disable-next-line
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
  // eslint-disable-next-line
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
  // eslint-disable-next-line
  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };
  // eslint-disable-next-line
  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };
  // eslint-disable-next-line
  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };
  // eslint-disable-next-line
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
              <div className="flex gap-2">
                <button
                  className="px-10 py-3 b-2 rounded-xl bg-green-600 hover:bg-green-500 transition-all text-white text-2xl shadow-lg"
                  onClick={() => createHeros(1)}
                >
                  Player <p className="text-xs">({price}) MATIC</p>
                </button>
                <button
                  className="px-10 py-3 b-2 rounded-xl bg-red-600 hover:bg-red-500 transition-all text-white text-2xl shadow-lg"
                  onClick={() => createHerosPack()}
                >
                  Pack <p className="text-xs">({price * 5}) MATIC</p>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-2 text-4xl font-bold bg-slate-100">
          BALANCE {provider ? balance.length : 0}
        </div>
        <div className="text-center p-2 text-2xl font-semibold bg-slate-200">
          THIS IS THE SWIPPER VIEW (Drag, Scroll, Swipe and more...)
        </div>
        <div
          style={{ maxHeight: "500px" }}
          className="flex my-6 justify-center overflow-hidden"
        >
          <div ref={prevButtonRef} className="my-16 p-2">
            <img src={"/slider-left-arrow.svg"} alt="ARROW" className="w-12" />
          </div>
          <div className="flex w-5/6 justify-center">
            {provider ? (
              <>
                {nfts.length > 0 ? (
                  <Swiper
                    modules={[
                      Navigation,
                      Pagination,
                      Scrollbar,
                      A11y,
                      Mousewheel,
                    ]}
                    spaceBetween={100}
                    speed={500}
                    slidesPerView={isWide ? 4 : isTablet ? 2 : isMobile ? 1 : 3}
                    navigation={{
                      prevEl: prevButtonRef.current,
                      nextEl: nextButtonRef.current,
                    }}
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                    mousewheel={{
                      thresholdTime: 800,
                      thresholdDelta: 1,
                    }}
                    onSlideChange={(event) => {
                      handleSlideChange(event);
                    }}
                    onSwiper={(swiper) => console.log(swiper)}
                  >
                    {nfts.map((ep: any) => (
                      <div key={ep.index}>
                        <SwiperSlide key={ep.heroId}>
                          <div
                            id={ep.index}
                            style={{ textAlign: "center", padding: "4px" }}
                          >
                            <div className="flex justify-center">
                              <img
                                src={getImage(ep.dna)}
                                alt="cat-img"
                                className="max-w-[18rem]"
                              />
                            </div>

                            <p
                              style={{
                                color: "#fff",
                                fontSize: "15px",
                                fontWeight: "700",
                                margin: "auto",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                maxWidth: "100%",
                                textAlign: "center",
                                marginTop: "8px",
                                flexGrow: 1,
                              }}
                            >
                              <span
                                style={{
                                  color: "#000",
                                  backgroundColor: "#fff",
                                  padding: "5px",
                                  marginRight: "5px",
                                }}
                              >
                                This is Player #{ep.heroId}
                                <br />
                                DNA: {ep.genes}
                              </span>
                            </p>
                          </div>
                        </SwiperSlide>
                      </div>
                    ))}
                  </Swiper>
                ) : (
                  <div className="flex items-center text-3xl font-bold">
                    {loading ? "Loading..." : "You Should Buy some players"}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center text-3xl font-bold">
                You Should Buy some players
              </div>
            )}
          </div>

          <div ref={nextButtonRef} className="my-16 p-2">
            <img src="/slider-right-arrow.svg" alt="Arrow" className="w-12" />
          </div>
        </div>
        <div className="text-center p-2 text-2xl font-semibold bg-slate-200">
          THIS IS THE FLEX WRAP VIEW
        </div>
        <div className="p-10 flex flex-wrap gap-4 justify-center">
          {provider ? (
            <>
              {" "}
              {nfts.map((ep: any) => (
                <div key={ep.index} className="w-60">
                  <div key={ep.heroId}>
                    <div
                      id={ep.index}
                      style={{ textAlign: "center", padding: "4px" }}
                    >
                      <img
                        src={getImage(ep.dna)}
                        alt="cat-img"
                        style={{
                          ...{ width: "500px", maxWidth: "100%" },
                        }}
                      />
                      <p
                        style={{
                          color: "#fff",
                          fontSize: "15px",
                          fontWeight: "700",
                          margin: "auto",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          maxWidth: "100%",
                          textAlign: "center",
                          marginTop: "8px",
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            color: "#000",
                            backgroundColor: "#fff",
                            padding: "5px",
                            marginRight: "5px",
                          }}
                        >
                          This is Player #{ep.heroId}
                          <br />
                          DNA: {ep.genes}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="flex items-center text-3xl font-bold">
                You Should Buy some players
              </div>
            </>
          )}
        </div>
      </main>
      <footer className="text-center text-xl font-semibold bg-slate-100 p-4 sticky">
        THIS IS A GAMEON TEST
      </footer>
    </div>
  );
}

export default Mint;
