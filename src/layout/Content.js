import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";
import { Button, Card, Col, Divider, Layout, Row } from "antd";
import { GithubOutlined } from "@ant-design/icons";

import ProposalForm from "../components/ProposalForm";
import ProposalModal from "../components/ProposalModal";
import Header from "./Header";
import ProposalList from "../components/ProposalList";
import { injectedConnector } from "../constants";

const { Content: AntdContent, Footer } = Layout;

const Content = function () {
  const { account, activate } = useWeb3React();
  const [openProposal, setOpenProposal] = useState(null);

  const {
    data: proposals = [],
    isValidating,
    mutate: refetchProposals,
  } = useSWR(["getProposals"]);

  const [isOpen, setIsOpen] = useState(false);

  const closeProposalForm = () => {
    setIsOpen(false);
    refetchProposals();
  };

  const openProposalModal = (proposal) => {
    setOpenProposal(proposal);
  };

  const closeProposalModal = (proposal) => {
    setOpenProposal(null);
  };

  const connectAccount = () => {
    activate(injectedConnector);
  };

  const openProposalForm = () => {
    setIsOpen(true);
  };

  return (
    <Layout>
      <Header isValidating={isValidating} />
      <AntdContent
        className="site-content"
        style={{ padding: "0 50px", marginTop: 64 }}
      >
        <Row className="site-layout-content">
          <Col span={12} offset={6}>
            <div className="container">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
                magna feugiat, pellentesque est ornare, dapibus odio. Praesent
                viverra ante a ullamcorper feugiat. Nullam a commodo mauris. In
                viverra molestie nisl, ac imperdiet risus dapibus vel. Donec
                eget vulputate odio, in blandit lorem. Sed maximus posuere
                tellus, sed dapibus quam. Fusce luctus, metus facilisis lobortis
                eleifend, arcu risus convallis nunc, a porta dolor dolor sit
                amet purus. Etiam at lacinia leo, nec varius mauris. Etiam
                tincidunt nisl sit amet tellus convallis, quis pulvinar orci
                tincidunt. Phasellus malesuada aliquam orci bibendum dictum.
                Curabitur condimentum ut sapien non semper. Proin nunc libero,
                sodales a libero vitae, dignissim sodales dolor.
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
                        style={{ marginTop: 34 }}
                        onClick={openProposalForm}
                      >
                        Create a Proposal!
                      </Button>
                    </Card>
                  )}
                </Col>

                <ProposalList
                  proposals={proposals}
                  openProposalModal={openProposalModal}
                />
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
      </AntdContent>
      <Footer>
        <div>
          Icons made by{" "}
          <a href="https://www.freepik.com" title="Freepik">
            Freepik
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
          <Divider type="vertical" />
          <a
            href="https://github.com/max-arias"
            target="_blank"
            rel="noreferrer"
            style={{ color: "inherit" }}
          >
            <GithubOutlined />
          </a>
        </div>
      </Footer>
    </Layout>
  );
};

export default Content;
