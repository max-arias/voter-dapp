import { Avatar, Button, Progress, Popover, Modal, Col, Row } from "antd";
import moment from "moment";
import { useWeb3React } from "@web3-react/core";

import { fetcher } from "../utils/swr";
import { abi as VoterAbi } from "../artifacts/contracts/Voter.sol/Voter.json";

import { ReactComponent as ThumbsDown } from "../assets/thumbs-down.svg";
import { ReactComponent as ThumbsUp } from "../assets/thumbs-up.svg";

const voterContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "";

const ProposalForm = ({ proposal, isOpen, handleClose }) => {
  const { account, library } = useWeb3React();

  const startVotingDate = moment
    .unix(proposal.votingStart.toNumber())
    .startOf("day");
  const startVotingUnix = startVotingDate.valueOf();
  const startVotingDisplay = startVotingDate.format("DD-MM-YYYY");

  const endVotingDate = moment.unix(proposal.votingEnd.toNumber()).endOf("day");
  const endVotingUnix = endVotingDate.valueOf();
  const endVotingDisplay = endVotingDate.format("DD-MM-YYYY");

  const currentTime = moment().utc().valueOf();
  const percentage =
    ((currentTime - startVotingUnix) / (endVotingUnix - startVotingUnix)) * 100;

  const fetch = fetcher(library, VoterAbi);

  const handleVote = (voteFor = false) => {
    // try {
    //   await fetch(
    //     voterContractAddress,
    //     "createProposal",
    //     values.proposal_name,
    //     values.proposal_description,
    //     voteStart.unix(),
    //     voteEnd.unix()
    //   );
    // } catch(e) {
    // }
    handleClose();
  };

  return (
    <Modal title={proposal.name} visible={isOpen} footer={null}>
      <Row gutter={[12, 12]}>
        <Col span={6}>
          <b>Proposed By:</b>
        </Col>
        <Col span={18}>
          <Popover
            content={
              <Avatar
                src={`https://avatars.dicebear.com/api/bottts/${proposal.owner}.svg`}
              />
            }
          >
            {proposal.owner}
          </Popover>
        </Col>
      </Row>
      <Row gutter={[12, 12]} style={{ marginTop: 24 }}>
        <Col span={6}>
          <b>Proposal:</b>
        </Col>
        <Col span={18}>{proposal.description}</Col>
      </Row>

      <Row gutter={[12, 12]} style={{ marginTop: 24 }}>
        <Col span={24} style={{ textAlign: "center" }}>
          Voting Window
        </Col>
      </Row>

      <Row gutter={[12, 12]}>
        <Col span={5}>{startVotingDisplay}</Col>
        <Col span={14} style={{ textAlign: "center" }}>
          <Progress percent={percentage} showInfo={false} />
        </Col>
        <Col span={5}>{endVotingDisplay}</Col>
      </Row>

      <Row gutter={[12, 12]} style={{ marginTop: 24 }}>
        <Col span={8} offset={4} style={{ textAlign: "center" }}>
          <Button
            type="primary"
            size="large"
            block
            onClick={() => handleVote(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThumbsUp
              style={{ marginRight: 12, width: 20, height: 20 }}
            ></ThumbsUp>
            For
          </Button>
        </Col>
        <Col span={8} style={{ textAlign: "center" }}>
          <Button
            type="primary"
            size="large"
            block
            onClick={() => handleVote(false)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThumbsDown
              style={{ marginRight: 12, width: 20, height: 20 }}
            ></ThumbsDown>
            Against
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default ProposalForm;
