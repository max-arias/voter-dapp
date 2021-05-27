//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "hardhat/console.sol";

// For each candidate, keep track of votes
struct Candidate {
  address owner;
  uint256 votes;
}

contract Election {
  uint256 public registrationStart;
  uint256 public registrationEnd;

  uint256 public votingStart;
  uint256 public votingEnd;

  string public name;

  address public owner;

  // Keep track of candidates
  Candidate[] candidates;

  // Has this candidate already registered?
  mapping(address => uint256) hasRegistered;

  // Has this voter voted this candidate?
  mapping(address => address) hasVotedCandidate;

  constructor(
    string memory _name,
    address _owner,
    uint256 _registrationStart,
    uint256 _registrationEnd,
    uint256 _votingStart,
    uint256 _votingEnd
  ) {
    name = _name;
    owner = _owner;
    registrationStart = _registrationStart;
    registrationEnd = _registrationEnd;
    votingStart = _votingStart;
    votingEnd = _votingEnd;
  }

  function addCandidate(address candidate) public {
    require(
      block.timestamp >= registrationStart && block.timestamp <= registrationEnd,
      "Outside Registration window"
    );

    if (hasRegistered[candidate] == 0) {
      Candidate memory newCandidate = Candidate(candidate, 0);
      candidates.push(newCandidate);
      hasRegistered[candidate] = candidates.length;
    }
  }

  function removeCandidate(address candidate) public {
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

  function getCandidates() public view returns (Candidate[] memory) {
    return candidates;
  }
}
