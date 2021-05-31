//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

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

contract Voting {
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

  modifier canRegisterToProposal(address candidate, uint256 proposalIndex) {
    Proposal storage proposal = proposals[proposalIndex];

    require(
      block.timestamp >= proposal.registrationStart &&
        block.timestamp <= proposal.registrationEnd,
      "Outside Registration window for this Proposal"
    );
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

  /*
  function removeCandidateFromProposal(address candidate, uint256 proposalIndex)
    public
    proposalExists(proposalIndex)
  {
    Proposal storage proposal = proposals[proposalIndex];

    require(
      proposal.candidates[candidate] != 0,
      "The candidate is not registered in this proposal"
    );

    // What's the index position of the candidate?
    uint256 index = hasRegistered[candidate];

    require(index > 0, "The candidate is not registered in this election");

    // Swap positions of the last item and the candidate we want to remove
    Candidate memory lastValue = candidates[candidates.length - 1];
    candidates[index - 1] = lastValue; // adjust for 1-based indexing
    candidates[candidates.length - 1] = candidates[index - 1];

    // Remove the last array item (ie. the item we want to remove)
    // Set the index position to 0 for this candidate to remove it
    candidates.pop();
    hasRegistered[candidate] = 0;
  }
*/

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
}
