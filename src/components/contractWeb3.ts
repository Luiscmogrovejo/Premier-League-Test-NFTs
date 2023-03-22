import Web3 from "web3";

declare global {
  interface Window {
    ethereum: any;
  }
}

export interface Hero {
  heroId: number;
  rarityScore: number;
  dna: number;
  genes: number;
  createdTime: number;
  owner: string;
}


const contractAddress = "0x4aBDec64F601f0848BEf93EBd537b9E392955bF1"; // Replace with your contract address
const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(
  [
    {
      inputs: [
        {
          internalType: "address",
          name: "_treasuryAddr",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_mintLimit",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "heroId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "date",
          type: "uint256",
        },
      ],
      name: "HeroCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "heroId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "date",
          type: "uint256",
        },
      ],
      name: "HeroUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "newLimit",
          type: "uint256",
        },
      ],
      name: "NewLimit",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "stakingContract",
          type: "address",
        },
      ],
      name: "StakingContract",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_approved",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "balance",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint128",
          name: "_dna",
          type: "uint128",
        },
      ],
      name: "calculateRarityScore",
      outputs: [
        {
          internalType: "uint128",
          name: "",
          type: "uint128",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_times",
          type: "uint256",
        },
      ],
      name: "createHeros",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "createHerosPack",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_heroId",
          type: "uint256",
        },
      ],
      name: "getHero",
      outputs: [
        {
          internalType: "uint256",
          name: "heroId",
          type: "uint256",
        },
        {
          internalType: "uint16",
          name: "rarityScore",
          type: "uint16",
        },
        {
          internalType: "uint128",
          name: "dna",
          type: "uint128",
        },
        {
          internalType: "uint8[15]",
          name: "Genes",
          type: "uint8[15]",
        },
        {
          internalType: "uint64",
          name: "createdTime",
          type: "uint64",
        },
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_addr",
          type: "address",
        },
      ],
      name: "getHeroCount",
      outputs: [
        {
          internalType: "uint256",
          name: "count",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_heroId",
          type: "uint256",
        },
      ],
      name: "getRarity",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "heroToApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_ownerInput",
          type: "address",
        },
      ],
      name: "herosOf",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_heroId",
          type: "uint256",
        },
      ],
      name: "isApproved",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "_operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_heroId",
          type: "uint256",
        },
      ],
      name: "isApprovedOperatorOf",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "mintLimit",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "tokenName",
          type: "string",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "price",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "randNonce",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "rarityScores",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "rewardPerNFT",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "rewardPerStage",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_from",
          type: "address",
        },
        {
          internalType: "address",
          name: "_to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_from",
          type: "address",
        },
        {
          internalType: "address",
          name: "_to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "_approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_tokenURI",
          type: "string",
        },
      ],
      name: "setHeroBaseURI",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "stakingContractAddr",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "tokenSymbol",
          type: "string",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "total",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_from",
          type: "address",
        },
        {
          internalType: "address",
          name: "_to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "treasuryAddr",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_newLimit",
          type: "uint256",
        },
      ],
      name: "updateHeroLimit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  contractAddress
);

export async function fetchAccount(): Promise<string> {
  if (window.ethereum) {
    try {
      await window.ethereum.enable();

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      console.log("ACCOUNTS", accounts[0]);
      return accounts[0];
    } catch (error) {
      console.log(error);
    }
  }
  return "";
}

export async function getHero(heroId: number): Promise<Hero> {
  const heroData = await contract.methods.getHero(heroId).call();
  const hero: Hero = {
    heroId: heroData.heroId,
    rarityScore: heroData.rarityScore,
    dna: heroData.dna,
    genes: heroData.Genes,
    createdTime: heroData.createdTime,
    owner: heroData.owner,
  };

  return hero;
}

export async function balanceOf(account:string): Promise<number> {
  const balance = await contract.methods.balanceOf(account).call();
  return balance;
}

export async function totalSupply(): Promise<number> {
  const balance = await contract.methods.totalSupply().call();
  return balance;
}

export async function ownerOf(heroId: number): Promise<string> {
  const owner = await contract.methods.ownerOf(heroId).call();
  return owner;
}

export async function transfer(to: string, tokenId: number): Promise<void> {
  const account = await fetchAccount();
  await contract.methods.transfer(to, tokenId).send({ from: account });
}

export async function approve(
  approved: string,
  tokenId: number
): Promise<void> {
  const account = await fetchAccount();
  await contract.methods.approve(approved, tokenId).send({ from: account });
}

export async function setApprovalForAll(
  operator: string,
  approved: boolean
): Promise<void> {
  const account = await fetchAccount();
  await contract.methods
    .setApprovalForAll(operator, approved)
    .send({ from: account });
}

export async function safeTransferFrom(
  from: string,
  to: string,
  tokenId: number,
  data: string = ""
): Promise<void> {
  const account = await fetchAccount();
  await contract.methods
    .safeTransferFrom(from, to, tokenId, data)
    .send({ from: account });
}

export async function transferFrom(
  from: string,
  to: string,
  tokenId: number
): Promise<void> {
  const account = await fetchAccount();
  await contract.methods
    .transferFrom(from, to, tokenId)
    .send({ from: account });
}

export async function setBaseURI(uri: string): Promise<void> {
  const account = await fetchAccount();
  await contract.methods.setBaseURI(uri).send({ from: account });
}

export async function setTokenURI(
  tokenId: number,
  tokenURI: string
): Promise<void> {
  const account = await fetchAccount();
  await contract.methods.setTokenURI(tokenId, tokenURI).send({ from: account });
}
export async function incF(x: number): Promise<number> {
  const result = await contract.methods.incF(x).call();
  return result;
}

export async function herosOf(account:string): Promise<number[]> {
  const result = await contract.methods.herosOf(account).call();
  return result;
}

export async function randMod(time: number): Promise<number> {
  const result = await contract.methods.randMod(time).call();
  return result;
}

export async function getPrice(): Promise<void> {
  await contract.methods
    .price()
    .call();
}

export async function createHeros(times: number): Promise<void> {
  const account = await fetchAccount();
  await contract.methods
    .createHeros(times)
    .send({ value: times * 0.01 * 10 ** 18, from: account });
}

export async function createHerosPack(): Promise<void> {
  const account = await fetchAccount();
  console.log("ACCOUNT TO PACK", account)
  await contract.methods
    .createHerosPack()
    .send({ value: 5 * 0.01 * 10 ** 18, from: account });
}

export async function genesToNumber(dna: number): Promise<number> {
  const result = await contract.methods.genesToNumber(dna).call();
  return result;
}

export async function getHeroCount(addr: string): Promise<number> {
  const result = await contract.methods.getHeroCount(addr).call();
  return result;
}

export async function updateHeroLimit(newLimit: number): Promise<void> {
  const account = await fetchAccount();
  await contract.methods.updateHeroLimit(newLimit).send({ from: account });
}

export async function calculateRarityScore(dna: number): Promise<number> {
  const result = await contract.methods.calculateRarityScore(dna).call();
  return result;
}

export async function getRarity(heroId: number): Promise<number> {
  const result = await contract.methods.getRarity(heroId).call();
  return result;
}

export async function setHeroBaseURI(tokenURI: string): Promise<void> {
  const account = await fetchAccount();
  await contract.methods.setHeroBaseURI(tokenURI).send({ from: account });
}