import { ethers } from "ethers";
import { isAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";

const fetcher =
  (library, abi) =>
  async (...args) => {
    const [arg1, arg2, ...params] = args;

    // Contract call
    if (isAddress(arg1)) {
      const address = arg1;
      const method = arg2;
      try {
        // Library not loaded? Get the provider
        const provider = new ethers.providers.JsonRpcProvider();
        const providerOrSigner = library?.getSigner() || provider;

        const contract = new Contract(address, abi, providerOrSigner);
        const res = await contract[method](...params);
        return res;
      } catch (e) {
        console.log(e);
      }
    }

    // it's a eth call
    const method = arg1;
    return library[method](arg2, ...params);
  };

export { fetcher };
