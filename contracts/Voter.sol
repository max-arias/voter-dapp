//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

struct Proposal {
  address owner;
  uint256 registrationStart;
  uint256 registrationEnd;
  uint256 votingStart;
  uint256 votingEnd;
  string name;
  string description;
  bool active;
  mapping(address => uint256) candidates;
  address[] candidateArr;
}

struct NakedProposal {
  address owner;
  uint256 registrationStart;
  uint256 registrationEnd;
  uint256 votingStart;
  uint256 votingEnd;
  string name;
  string description;
  bool active;
}

contract Voter {
  // Workaround for creating Structs with mappings
  uint256 numProposals;
  mapping(uint256 => Proposal) proposals;

  // Validate name, registration and voting periods
  modifier proposalValid(
    string memory _name,
    uint256 _registrationStart,
    uint256 _registrationEnd,
    uint256 _votingStart,
    uint256 _votingEnd
  ) {
    require(bytes(_name).length > 0, "A Proposal name is required");

    require(
      _registrationEnd > _registrationStart,
      "Registration End must be after than Registration Start"
    );

    require(
      _votingStart > _registrationEnd,
      "Voting must start after Registration End"
    );

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

  // Make sure the candidate is not in the proposal already
  modifier candidateNotInProposal(address candidate, uint256 proposalIndex) {
    Proposal storage proposal = proposals[proposalIndex];

    require(
      proposal.candidates[candidate] == 0,
      "Candidate already enrolled in Proposal"
    );
    _;
  }

  //Make sure the candidate is in the proposal
  modifier candidateInProposal(address candidate, uint256 proposalIndex) {
    Proposal storage proposal = proposals[proposalIndex];

    require(
      proposal.candidates[candidate] != 0,
      "Candidate is not registered in the Proposal"
    );
    _;
  }

  modifier canRegisterToProposal(address candidate, uint256 proposalIndex) {
    Proposal storage proposal = proposals[proposalIndex];

    require(
      block.timestamp >= proposal.registrationStart &&
        block.timestamp <= proposal.registrationEnd,
      "Outside Registration window for this Proposal"
    );
    _;
  }

  modifier isCandidate(address candidate) {
    require(candidate == msg.sender, "The candidate is not the sender");
    _;
  }

  // Creates a new proposal
  function createProposal(
    string memory _name,
    string memory _desc,
    uint256 _registrationStart,
    uint256 _registrationEnd,
    uint256 _votingStart,
    uint256 _votingEnd
  )
    public
    proposalValid(
      _name,
      _registrationStart,
      _registrationEnd,
      _votingStart,
      _votingEnd
    )
  {
    Proposal storage newProposal = proposals[numProposals];

    newProposal.owner = msg.sender;
    newProposal.registrationStart = _registrationStart;
    newProposal.registrationEnd = _registrationEnd;
    newProposal.votingStart = _votingStart;
    newProposal.votingEnd = _votingEnd;
    newProposal.name = _name;
    newProposal.description = _desc;

    // Push an empty value so we can store the index in the candidate mapping
    newProposal.candidateArr.push();

    numProposals++;
  }

  // Adds a Candidate to the Proposal
  function addCandidateToProposal(address candidate, uint256 proposalIndex)
    public
    // Validate that this proposal exists
    proposalExists(proposalIndex)
    // Validate that this candidate is not already in the proposal
    candidateNotInProposal(candidate, proposalIndex)
    // Can register to Proposal
    canRegisterToProposal(candidate, proposalIndex)
  {
    Proposal storage proposal = proposals[proposalIndex];

    // This value will always be > 0 because we pushed an empty value when we created the Struct
    uint256 candidatesIdx = proposal.candidateArr.length;

    // Append the candidate to the list of candidates
    proposal.candidateArr.push(candidate);
    proposal.candidates[candidate] = candidatesIdx;
  }

  function removeCandidateFromProposal(address candidate, uint256 proposalIndex)
    public
    isCandidate(candidate)
    proposalExists(proposalIndex)
    candidateInProposal(candidate, proposalIndex)
  {
    Proposal storage proposal = proposals[proposalIndex];

    // What's the index position of the candidate?
    uint256 candidateIndex = proposal.candidates[candidate];

    // Last item
    address lastCandidate =
      proposal.candidateArr[proposal.candidateArr.length - 1];

    // Move last item to the position of the candidate we want to remove
    proposal.candidateArr[candidateIndex] = lastCandidate;
    // Move the candidate to the last position
    proposal.candidateArr[proposal.candidateArr.length - 1] = proposal
      .candidateArr[candidateIndex];

    // Remove the last array item (ie. the item we want to remove)
    // Set the index position to 0 for this candidate to remove it
    proposal.candidateArr.pop();
    proposal.candidates[candidate] = 0;
  }

  // Returns all candidates in the Proposal
  function getProposalCandidates(uint256 proposalIndex)
    public
    view
    proposalExists(proposalIndex)
    returns (address[] memory)
  {
    Proposal storage proposal = proposals[proposalIndex];

    return proposal.candidateArr;
  }

  // Returns proposals
  // TODO: Figure out a way to return an array of structs with a mapping inside
  function getProposals() public view returns (NakedProposal[] memory) {
    NakedProposal[] storage proposalsToReturn = NakedProposal[];

    for (uint256 i = 0; i < numProposals; i++) {
      Proposal storage proposal = proposals[i];

      NakedProposal memory newNakedProposal =
        NakedProposal({
          owner: proposal.owner,
          registrationStart: proposal.registrationStart,
          registrationEnd: proposal.registrationEnd,
          votingStart: proposal.votingStart,
          votingEnd: proposal.votingEnd,
          name: proposal.name,
          description: proposal.description,
          active: proposal.active
        });

      proposalsToReturn.push(newNakedProposal);
    }

    return proposalsToReturn;
  }
}
