import { useEffect, useRef } from "react";
import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { abi as VoterAbi } from "../abi/Voter.json";

const voterContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "";

function useContract(library) {
  let contract = useRef();

  useEffect(() => {
    // Library not loaded? Get the provider
    const provider = new ethers.providers.JsonRpcProvider();
    const providerOrSigner = library?.getSigner() || provider;

    contract.current = new Contract(
      voterContractAddress,
      VoterAbi,
      providerOrSigner
    );
  }, [library]);

  return contract.current;
}

export default useContract;
