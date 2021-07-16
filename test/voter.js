const { expect } = require("chai");
const { ethers } = require("hardhat");

const testingStart = new Date().valueOf();

let hardhatVoter;
const createProposal = () => {
  return hardhatVoter.createProposal(
    "Test Proposal",
    "Lorem ipsum - description",
    testingStart - 86400,
    testingStart + 86400
  );
};

describe("Voter", () => {
  beforeEach(async () => {
    const Voter = await ethers.getContractFactory("Voter");
    hardhatVoter = await Voter.deploy();
    await hardhatVoter.deployed();
  });

  describe("getProposals", () => {
    it("there are no proposals", async () => {
      expect(await hardhatVoter.getProposals()).to.eql([]);
    });

    it("returns all proposals", async () => {
      await createProposal();

      const res = await hardhatVoter.getProposals();

      const [[id, owner, votingStart, votingEnd, name, description]] = res;

      expect(res.length).to.equal(1);
      expect(id.toString()).to.equal("0");
      expect(owner).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
      expect(votingStart.toString()).to.equal(`${testingStart - 86400}`);
      expect(votingEnd.toString()).to.equal(`${testingStart + 86400}`);
      expect(name).to.equal("Test Proposal");
      expect(description).to.equal("Lorem ipsum - description");
    });
  });

  describe("getProposalVotes", () => {
    it("invalid proposal", async () => {});
    it("proposal without votes", () => {});
    it("proposal with votes", () => {});
  });

  describe("hasVotedOnProposal", () => {
    it("invalid proposal", () => {});
    it("has voted on proposal", () => {});
    it("has not voted on proposal", () => {});
  });

  describe("voteOnProposal", () => {
    it("invalidd proposal", () => {});
    it("outside voting proposal", () => {});
    it("has already voted on proposal", () => {});
    it("vote on proposal positive", () => {});
    it("vote on proposal negative", () => {});
    it("emited event on voted on proposal", () => {});
  });

  describe("createProposal", () => {
    it("invalid proposal", () => {});
    it("creates a proposal", () => {});
    it("emited event on created proposal", () => {});
  });
});
