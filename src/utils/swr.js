import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { abi as VoterAbi } from "../artifacts/contracts/Voter.sol/Voter.json";

const voterContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "";
const infuraProjectKey = process.env.REACT_APP_INFURA_PROJECT_KEY || null;

const fetcher =
  (library) =>
  async (...args) => {
    const [method, ...params] = args;

    // Library not loaded? Get the provider
    const provider = new ethers.providers.JsonRpcProvider(
      infuraProjectKey
        ? `https://ropsten.infura.io/v3/${infuraProjectKey}`
        : null
    );
    const providerOrSigner = library?.getSigner() || provider;

    const contract = new Contract(
      voterContractAddress,
      VoterAbi,
      providerOrSigner
    );

    try {
      const res = await contract[method](...params);
      return res;
    } catch (e) {
      return Promise.reject(e);
    }
  };

export default fetcher;
