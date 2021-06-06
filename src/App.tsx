import React, { useState } from "react";
import Voter from "./artifacts/contracts/Voter.sol/Voter.json";
import { ethers } from "ethers";

const voterContractAddress: string =
  process.env.REACT_APP_CONTRACT_ADDRESS || "";

// TODO: Move this
declare global {
  interface Window {
    ethereum: any;
  }
}

const App: React.FC = (): JSX.Element => {
  const [proposals, setProposals] = useState<Array<any>>([]);

  // Fetch access to user account
  // async function requestAccount() {
  //   await window.ethereum.request({ method: "eth_requestAccounts" });
  // }

  // Fetch current proposals
  // TODO: This should fetch all proposals
  async function getProposals() {
    // if (typeof window.ethereum !== "undefined") {
    //   const provider = new ethers.providers.Web3Provider(window.ethereum);
    //   const contract = new ethers.Contract(
    //     voterContractAddress,
    //     Voter.abi,
    //     provider
    //   );
    //   try {
    //     const data = await contract.greet();
    //     console.log("data: ", data);
    //   } catch (err) {
    //     console.log("Error: ", err);
    //   }
    // }
  }

  return <div>Hello World</div>;
};

export default App;
