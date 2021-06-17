import { useState } from "react";
import { ethers } from "ethers";
import useSWR, { SWRConfig } from "swr";
import { isAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";

// Our ABI
import { abi as VoterAbi } from "./artifacts/contracts/Voter.sol/Voter.json";

// Convenience Hook
import { useWeb3React } from "@web3-react/core";
// Connections to different chains
import { InjectedConnector } from "@web3-react/injected-connector";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Layout,
  Row,
  Spin,
  Typography,
} from "antd";

import Proposal from "./components/Proposal";
import ProposalForm from "./components/ProposalForm";

import "./App.css";

const { Header, Content } = Layout;
const { Title } = Typography;

const voterContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "";

const fetcher =
  (library, abi) =>
  async (...args) => {
    const [arg1, arg2, ...params] = args;

    // Contract call
    if (isAddress(arg1)) {
      const address = arg1;
      const method = arg2;
      try {
        // Library not loaded? Just get an a provider
        const provider = new ethers.providers.JsonRpcProvider();
        const providerOrSigner = library?.getSigner() || provider;

        const contract = new Contract(address, abi, providerOrSigner);
        const res = await contract[method](...params);
        console.log({ res });
        return res;
      } catch (e) {
        console.log(e);
      }
    }

    // it's a eth call
    const method = arg1;
    return library[method](arg2, ...params);
  };

const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
    1337, // Hardhat, Localhost
  ],
});

const App = () => {
  const web3React = useWeb3React();
  const { account, activate, library } = web3React;

  const { data: proposals = [], isValidating } = useSWR(
    [voterContractAddress, "getProposals"],
    {
      fetcher: fetcher(library, VoterAbi),
    }
  );

  const [isOpen, setIsOpen] = useState(false);

  const connectAccount = () => {
    activate(injectedConnector);
  };

  const openProposalForm = () => {
    setIsOpen(true);
  };

  const closeProposalForm = () => {
    setIsOpen(false);
  };

  return (
    <SWRConfig value={{ fetcher: fetcher(library, VoterAbi) }}>
      <Layout>
        <Header
          className="site-header"
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100%",
          }}
        >
          <Title level={2}>Voter dApp</Title>

          <div className="account-container">
            {isValidating ? <Spin style={{ marginRight: 12 }} /> : null}
            {account ? (
              <>
                <Avatar
                  src={`https://avatars.dicebear.com/api/bottts/${account}.svg`}
                />
                <span style={{ color: "#fff", paddingLeft: 12 }}>
                  {`${account.slice(0, 6)} ... ${account.slice(-4)}`}
                </span>
              </>
            ) : (
              <Button type="primary" shape="round" onClick={connectAccount}>
                Connect
              </Button>
            )}
          </div>
        </Header>
        <Content
          className="site-content"
          style={{ padding: "0 50px", marginTop: 64 }}
        >
          <Row className="site-layout-content">
            <Col span={12} offset={6}>
              <div className="container">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  non magna feugiat, pellentesque est ornare, dapibus odio.
                  Praesent viverra ante a ullamcorper feugiat. Nullam a commodo
                  mauris. In viverra molestie nisl, ac imperdiet risus dapibus
                  vel. Donec eget vulputate odio, in blandit lorem. Sed maximus
                  posuere tellus, sed dapibus quam. Fusce luctus, metus
                  facilisis lobortis eleifend, arcu risus convallis nunc, a
                  porta dolor dolor sit amet purus. Etiam at lacinia leo, nec
                  varius mauris. Etiam tincidunt nisl sit amet tellus convallis,
                  quis pulvinar orci tincidunt. Phasellus malesuada aliquam orci
                  bibendum dictum. Curabitur condimentum ut sapien non semper.
                  Proin nunc libero, sodales a libero vitae, dignissim sodales
                  dolor.
                </p>
                <Divider />

                <Row gutter={[12, 12]}>
                  {proposals.map((item) => (
                    <Col span={8} key={item.owner}>
                      <Proposal item={item} />
                    </Col>
                  ))}

                  {!proposals.length && !account ? (
                    <Col span={8}>
                      <Button
                        type="primary"
                        shape="round"
                        onClick={connectAccount}
                      >
                        Connect to view Proposals!
                      </Button>
                    </Col>
                  ) : null}
                  <Col span={8}>
                    <Card
                      title="Something to Propose?"
                      style={{ textAlign: "center", width: "fit-content" }}
                    >
                      <Button onClick={openProposalForm}>
                        Create a Proposal!
                      </Button>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <ProposalForm isOpen={isOpen} handleClose={closeProposalForm} />
        </Content>
      </Layout>
    </SWRConfig>
  );

  // TODO: Define these types
  // const [accounts, setAccounts] = useState([]);
  // const [proposals, setProposals] = useState([]);

  // // Move to a hook?
  // if (typeof window.ethereum !== "undefined") {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   contract = new ethers.Contract(voterContractAddress, Voter.abi, provider);

  //   // Refresh on network change
  //   provider.on("network", (newNetwork, oldNetwork) => {
  //     // When a Provider makes its initial connection, it emits a "network"
  //     // event with a null oldNetwork along with the newNetwork. So, if the
  //     // oldNetwork exists, it represents a changing network
  //     if (oldNetwork) {
  //       window.location.reload();
  //     }
  //   });
  // }

  // // TODO: Create a form
  // const createProposal = async function () {
  //   await contract?.createProposal(
  //     "test",
  //     "testing new contract",
  //     Date.now(),
  //     Date.now() + 10000
  //   );
  // };

  // // Fetch access to user account
  // async function requestAccounts() {
  //   //TODO: Keep accounts cached?
  //   return await window.ethereum.request({ method: "eth_requestAccounts" });
  // }

  // useEffect(() => {
  //   // TODO: Use SWR
  //   const fetchData = async () => {
  //     if (contract) {
  //       try {
  //         const data = await contract.proposals;
  //         console.log("data: ", data);
  //         setProposals(data);
  //       } catch (err) {
  //         console.log("Error: ", err);
  //       }
  //     }

  //     if (window.ethereum) {
  //       try {
  //         const accounts = await requestAccounts();
  //         setAccounts(accounts);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, []);

  // return (
  //   <div>
  //     <div>accounts: {accounts}</div>
  //     <div>proposals: {proposals}</div>
  //     <div>
  //       <button onClick={createProposal}>Create Proposal</button>
  //     </div>
  //   </div>
  // );
};

export default App;
