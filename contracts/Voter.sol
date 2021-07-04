//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Voter {
  // What we want to propose to do
  struct Proposal {
    uint256 id;
    address owner;
    uint256 votingStart;
    uint256 votingEnd;
    string name;
    string description;
  }

  event ProposalCreated(
    uint256 id,
    address owner,
    uint256 votingStart,
    uint256 votingEnd,
    string name,
    string description
  );

  event ProposalVoted(
    uint256 proposalId,
    address voter,
    uint256 positiveVotes,
    uint256 negativeVotes,
    address[] voters
  );

  // Keeps track of which addresses voted and a pre-calculated total of positive and negative votes
  struct ProposalVotes {
    mapping(address => uint256) votes;
    uint256 positiveVotes;
    uint256 negativeVotes;
    address[] voters;
  }

  Proposal[] proposals;

  // Maps a Proposal Index to a struct of proposal votes
  mapping(uint256 => ProposalVotes) proposalVotes;

  // -- modifiers --

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
  modifier hasNotVotedOnProposal(uint256 proposalIndex) {
    ProposalVotes storage proposalVote = proposalVotes[proposalIndex];

    require(proposalVote.votes[msg.sender] == 0, "Already Voted on Proposal");
    _;
  }

  // Make sure that we're in the voting window
  modifier inVotingWindow(uint256 proposalIndex) {
    ProposalVotes storage proposalVote = proposalVotes[proposalIndex];

    require(
      block.timestamp >= proposals[proposalIndex].votingStart &&
        block.timestamp <= proposals[proposalIndex].votingEnd,
      "Outside voting window:"
    );

    _;
  }

  // -- functions --

  // Fetches proposals
  function getProposals() public view returns (Proposal[] memory) {
    return proposals;
  }

  // Fetches number of positive and negative votes and who voted
  function getProposalVotes(uint256 proposalIndex)
    public
    view
    proposalExists(proposalIndex)
    returns (
      uint256,
      uint256,
      address[] memory
    )
  {
    return (
      proposalVotes[proposalIndex].positiveVotes,
      proposalVotes[proposalIndex].negativeVotes,
      proposalVotes[proposalIndex].voters
    );
  }

  // Returns if the callee has voted on a proposal
  function hasVotedOnProposal(uint256 proposalIndex)
    public
    view
    proposalExists(proposalIndex)
    returns (bool)
  {
    ProposalVotes storage proposalVote = proposalVotes[proposalIndex];

    return proposalVote.votes[msg.sender] > 0;
  }

  // Vote on a proposal
  function voteOnProposal(bool _votedFor, uint256 proposalIndex)
    public
    proposalExists(proposalIndex)
    inVotingWindow(proposalIndex)
    hasNotVotedOnProposal(proposalIndex)
  {
    ProposalVotes storage proposalVote = proposalVotes[proposalIndex];

    // 1 for a positive vote, 2 for a negative vote (0 for addresses that haven't voted)
    if (_votedFor) {
      proposalVote.votes[msg.sender] = 1;
      proposalVote.positiveVotes++;
    } else {
      proposalVote.votes[msg.sender] = 2;
      proposalVote.negativeVotes++;
    }

    proposalVote.voters.push(msg.sender);

    emit ProposalVoted(
      proposalIndex,
      msg.sender,
      proposalVote.positiveVotes,
      proposalVote.negativeVotes,
      proposalVote.voters
    );
  }

  // Creates a new proposal
  // TODO: Validate that vote start/end are legit dates?
  function createProposal(
    string memory _name,
    string memory _desc,
    uint256 _votingStart,
    uint256 _votingEnd
  ) public proposalValid(_name, _votingStart, _votingEnd) {
    uint256 proposalId = proposals.length;

    Proposal memory newProposal =
      Proposal({
        id: proposalId,
        owner: msg.sender,
        votingStart: _votingStart,
        votingEnd: _votingEnd,
        name: _name,
        description: _desc
      });

    proposals.push(newProposal);

    emit ProposalCreated(
      proposalId,
      msg.sender,
      _votingStart,
      _votingEnd,
      _name,
      _desc
    );
  }
}
