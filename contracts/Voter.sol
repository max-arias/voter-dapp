//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Voter {
  // What we want to propose to do
  struct Proposal {
    address owner;
    uint256 votingStart;
    uint256 votingEnd;
    string name;
    string description;
  }

  event ProposalCreated(
    uint256 id,
    uint256 votingStart,
    uint256 votingEnd,
    string name,
    string description
  );

  struct ProposalVotes {
    mapping(address => uint256) votes;
    uint256 positiveVotes;
    uint256 negativeVotes;
  }

  Proposal[] proposals;
  mapping(uint256 => ProposalVotes) proposalVotes;

  // Validate name and voting periods
  modifier proposalValid(
    string memory _name,
    uint256 _votingStart,
    uint256 _votingEnd
  ) {
    require(bytes(_name).length > 0, "A Proposal name is required");

    require(_votingStart > 0, "Voting Start must be valid");
    require(_votingEnd > 0, "Voting End must be valid");

    require(_votingEnd > _votingStart, "Voting End must be after Voting Start");

    _;
  }

  // If the name is set then we know the Proposal exists
  modifier proposalExists(uint256 proposalIndex) {
    require(
      bytes(proposals[proposalIndex].name).length != 0,
      "Invalid Proposal"
    );
    _;
  }

  // Make sure the voter has not voted on the proposal
  modifier hasNotVotedOnProposal(address voter, uint256 proposalIndex) {
    ProposalVotes storage proposalVote = proposalVotes[proposalIndex];

    require(proposalVote.votes[voter] == 0, "Already Voted on Proposal");
    _;
  }

  function getProposals() public view returns (Proposal[] memory) {
    return proposals;
  }

  // Creates a new proposal
  // TODO: Validate that voting values are legit dates?
  function createProposal(
    string memory _name,
    string memory _desc,
    uint256 _votingStart,
    uint256 _votingEnd
  ) public proposalValid(_name, _votingStart, _votingEnd) {
    Proposal memory newProposal =
      Proposal({
        owner: msg.sender,
        votingStart: _votingStart,
        votingEnd: _votingEnd,
        name: _name,
        description: _desc
      });

    proposals.push(newProposal);

    emit ProposalCreated(
      proposals.length - 1,
      _votingStart,
      _votingEnd,
      _name,
      _desc
    );
  }
}
