import {
  Avatar,
  Button,
  Progress,
  Popover,
  Modal,
  Col,
  Row,
  Typography,
  notification,
} from "antd";
import useSWR from "swr";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import { ReactComponent as ThumbsDown } from "../assets/thumbs-down.svg";
import { ReactComponent as ThumbsUp } from "../assets/thumbs-up.svg";

// swr fetcher
import fetcher from "../utils/swr";

const { confirm } = Modal;
const { Text, Title } = Typography;

const ProposalForm = ({ proposal, isOpen, handleClose }) => {
  const [votePassed, setVotePassed] = useState(false);
  const { account, library } = useWeb3React();

  const fetch = fetcher(library);

  // Fetch votes and voters for this proposal
  const {
    data: [postiveVotes, negativeVotes, voters] = [0, 0, null],
    mutate: refetchVotes,
  } = useSWR(["getProposalVotes", proposal.id.toNumber()]);

  const { data: hasVoted = false, mutate: refetchHasVotedOnProposal } = useSWR([
    "hasVotedOnProposal",
    proposal.id,
  ]);

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

  // Check if votes has passed
  useEffect(() => {
    if (postiveVotes?.toNumber() > negativeVotes?.toNumber()) {
      setVotePassed(true);
    }
  }, [postiveVotes, negativeVotes]);

  const handleVote = (voteFor = false) => {
    confirm({
      title: "Are you sure?",
      icon: <ExclamationCircleOutlined />,
      content: `You are voting ${voteFor ? '"For"' : '"Against"'}`,
      onOk() {
        return fetch("voteOnProposal", voteFor, proposal.id.toNumber())
          .then((result) => {
            notification.success({
              message: "Thanks for voting!",
            });
            refetchVotes();
            refetchHasVotedOnProposal();
          })
          .catch((e) => {
            notification.error({
              message: "There was an error processing your vote",
              description: e.data.message,
            });
          });
      },
      onCancel() {},
    });

    handleClose();
  };

  const canNotVote = () => {
    if (
      currentTime < startVotingUnix ||
      currentTime > endVotingUnix ||
      hasVoted
    ) {
      return true;
    }

    return false;
  };

  return (
    <Modal
      title={proposal.name}
      visible={isOpen}
      footer={null}
      onCancel={handleClose}
    >
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
          <b>Voting Window</b>
        </Col>
      </Row>

      <Row gutter={[12, 12]}>
        <Col span={5}>{startVotingDisplay}</Col>
        <Col span={14} style={{ textAlign: "center" }}>
          <Progress percent={percentage} showInfo={false} />
        </Col>
        <Col span={5}>{endVotingDisplay}</Col>
      </Row>

      {currentTime >= endVotingUnix ? (
        <Row gutter={[12, 12]} style={{ marginTop: 24 }}>
          <Col span={24} style={{ textAlign: "center" }}>
            <Text strong type="warning">
              Voting has ended!
            </Text>

            <p>
              <Text strong style={{ marginRight: 12 }}>
                The vote...
              </Text>
              {votePassed ? (
                <Text strong type="success">
                  Passed!
                </Text>
              ) : (
                <Text strong type="danger">
                  Did not pass!
                </Text>
              )}
            </p>
          </Col>
        </Row>
      ) : (
        <Row gutter={[12, 12]} style={{ marginTop: 24 }}>
          <Col span={6}>
            <b>Votes:</b>
          </Col>
          <Col span={18}>
            <Row gutter={[12, 12]}>
              <Col span={12}>For: {postiveVotes?.toNumber()}</Col>
              <Col span={12}>Against: {negativeVotes?.toNumber()}</Col>
            </Row>
          </Col>
        </Row>
      )}

      <Row gutter={[12, 12]} style={{ marginTop: 24 }}>
        <Col span={6}>
          <b>Voters:</b>
        </Col>
        <Col span={18}>
          {voters
            ? voters.map((v) => (
                <Row gutter={[12, 12]}>
                  <Col span={6}>
                    <Avatar
                      src={`https://avatars.dicebear.com/api/bottts/${v}.svg`}
                    />
                  </Col>
                  <Col span={18}>{v}</Col>
                </Row>
              ))
            : "&mdash;"}
        </Col>
      </Row>

      {!account ? (
        <Row gutter={[12, 12]} style={{ marginTop: 24 }}>
          <Col span={24} style={{ textAlign: "center" }}>
            <Title level={5}>Please connect to be able to Vote</Title>
          </Col>
        </Row>
      ) : (
        <Row gutter={[12, 12]} style={{ marginTop: 24 }}>
          <Col span={8} offset={4} style={{ textAlign: "center" }}>
            <Button
              type="primary"
              size="large"
              block
              disabled={canNotVote()}
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
              disabled={canNotVote()}
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
      )}
    </Modal>
  );
};

export default ProposalForm;
