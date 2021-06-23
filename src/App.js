import { useEffect, useState } from "react";
import useSWR, { SWRConfig } from "swr";
import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";

// Our ABI
import { abi as VoterAbi } from "./artifacts/contracts/Voter.sol/Voter.json";
// Convenience Hook
import { useWeb3React } from "@web3-react/core";
// Connections to different chains
import { InjectedConnector } from "@web3-react/injected-connector";
// swr fetcher
import { fetcher } from "./utils/swr";

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
import ProposalModal from "./components/ProposalModal";

import "./App.css";

const { Header, Content } = Layout;
const { Title } = Typography;

const voterContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "";

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
  const { account, activate, library } = useWeb3React();
  const [openProposal, setOpenProposal] = useState(null);

  const {
    data: proposals = [],
    isValidating,
    mutate,
  } = useSWR([voterContractAddress, "getProposals"], {
    fetcher: fetcher(library, VoterAbi),
  });

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

  const openProposalModal = (proposal) => {
    console.log("clicked");
    setOpenProposal(proposal);
  };

  const closeProposalModal = (proposal) => {
    setOpenProposal(null);
  };

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider();
    const providerOrSigner = library?.getSigner() || provider;
    let contract;

    // TODO: Move this to a hook
    try {
      contract = new Contract(voterContractAddress, VoterAbi, providerOrSigner);

      contract.on("ProposalCreated", () => mutate());
    } catch (e) {
      console.log(e);
    }

    return () => {
      contract?.removeAllListeners("ProposalCreated");
    };
  }, [library, mutate]);

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
                  {`${account.slice(0, 6)}...${account.slice(-4)}`}
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
                  <Col span={8}>
                    {!account ? (
                      <Card
                        hoverable
                        title="Connect to create Proposals!"
                        style={{ textAlign: "center" }}
                      >
                        <Button
                          style={{ marginTop: 29 }}
                          type="primary"
                          shape="round"
                          onClick={connectAccount}
                        >
                          Connect
                        </Button>
                      </Card>
                    ) : (
                      <Card
                        hoverable
                        title="Something to Propose?"
                        style={{ textAlign: "center" }}
                      >
                        <Button
                          style={{ marginTop: 29 }}
                          onClick={openProposalForm}
                        >
                          Create a Proposal!
                        </Button>
                      </Card>
                    )}
                  </Col>

                  {proposals.map((item) => (
                    <Col span={8} key={`${item.owner}-${item.name}`}>
                      <Proposal
                        item={item}
                        handleOpen={() => openProposalModal(item)}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>

          <ProposalForm isOpen={isOpen} handleClose={closeProposalForm} />
          {!!openProposal ? (
            <ProposalModal
              isOpen={!!openProposal}
              proposal={openProposal}
              handleClose={closeProposalModal}
            />
          ) : null}
        </Content>
      </Layout>
    </SWRConfig>
  );
};

export default App;
