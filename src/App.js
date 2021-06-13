import { useState } from "react";
// import useSWR from "swr";

// Our ABI
// import Voter from "./artifacts/contracts/Voter.sol/Voter.json";

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
  Typography,
} from "antd";

import Proposal from "./components/Proposal";
import ProposalForm from "./components/ProposalForm";

import "./App.css";

const { Header, Content } = Layout;
const { Title } = Typography;

// const voterContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "";

// const fetcher =
//   (library) =>
//   (...args) => {
//     const [method, ...params] = args;
//     console.log(method, params);
//     return library[method](...params);
//   };

const App = () => {
  const proposals = [];
  const { account, activate } = useWeb3React();

  // const { data: balance, mutate } = useSWR([], {
  //   fetcher: fetcher(library, Voter),
  // });

  const [isOpen, setIsOpen] = useState(false);

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
    <>
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
            {account ? (
              <>
                <Avatar
                  src={`https://avatars.dicebear.com/api/bottts/${account}.svg`}
                />
                <span style={{ color: "#fff", paddingLeft: 12 }}>
                  {`${account.slice(0, 4)}...${account.slice(-4)}`}
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
                <Card
                  title="Something to Propose?"
                  style={{ textAlign: "center", width: "fit-content" }}
                >
                  <Button onClick={openProposalForm}>Create a Proposal!</Button>
                </Card>

                {proposals.length ? (
                  <Row gutter={16}>
                    {proposals.map((item) => (
                      <Col span={6}>
                        <Proposal item={item} />
                      </Col>
                    ))}
                  </Row>
                ) : null}
              </div>
            </Col>
          </Row>
          <ProposalForm isOpen={isOpen} handleClose={closeProposalForm} />
        </Content>
      </Layout>
    </>
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
