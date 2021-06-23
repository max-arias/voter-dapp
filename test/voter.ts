//TODO: Update tests to new Contract shape

// import { expect } from "chai";
// import { ethers, network } from "hardhat";
// import { add, getUnixTime } from "date-fns";

// describe("Election", function () {
//   const electionName = "Ye old Election";
//   const startDate = new Date();
//   const endDate = add(startDate, { days: 10 });
//   const votingStart = add(endDate, { weeks: 1 });
//   const votingEnd = add(votingStart, { days: 10 });

//   describe("Election registration period", async () => {
//     let election;
//     let count = 0;

//     beforeEach(async () => {
//       await network.provider.send("evm_setNextBlockTimestamp", [
//         getUnixTime(add(startDate, { minutes: ++count })),
//       ]);

//       const [owner] = await ethers.getSigners();

//       const ElectionFactory = await ethers.getContractFactory("Election");
//       election = await ElectionFactory.deploy(
//         electionName,
//         await owner.getAddress(),
//         getUnixTime(startDate),
//         getUnixTime(endDate),
//         getUnixTime(votingStart),
//         getUnixTime(votingEnd)
//       );

//       await election.deployed();
//     });

//     it("Returns the election starts dates, end dates and name", async () => {
//       expect(await election.registrationStart()).to.equal(
//         getUnixTime(startDate)
//       );
//       expect(await election.registrationEnd()).to.equal(getUnixTime(endDate));
//       expect(await election.votingStart()).to.equal(getUnixTime(votingStart));
//       expect(await election.votingEnd()).to.equal(getUnixTime(votingEnd));
//       expect(await election.name()).to.equal(electionName);
//     });

//     it("Returns the candidates", async () => {
//       const [addr1] = await ethers.getSigners();
//       const address = await addr1.getAddress();

//       expect(await election.getCandidates()).to.deep.equal([]);

//       await election.addCandidate(address);

//       const candidatesOnChain = await election.getCandidates();

//       expect(candidatesOnChain[0][0]).to.deep.equal(address);
//     });

//     it("Adds and removes candidates", async () => {
//       const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

//       const address1 = await addr1.getAddress();
//       const address2 = await addr2.getAddress();
//       const address3 = await addr3.getAddress();
//       const address4 = await addr4.getAddress();

//       expect(await election.getCandidates()).to.deep.equal([]);

//       await election.addCandidate(address1);
//       await election.addCandidate(address2);
//       await election.addCandidate(address3);
//       await election.addCandidate(address4);

//       let candidatesOnChain = await election.getCandidates();

//       let addresses = candidatesOnChain.map((item) => item[0]);

//       expect(addresses).to.deep.equal([address1, address2, address3, address4]);

//       await election.removeCandidate(address2);

//       candidatesOnChain = await election.getCandidates();
//       addresses = candidatesOnChain.map((item) => item[0]);

//       expect(addresses).to.deep.equal([address1, address4, address3]);
//     });

//     it("Throws an error when trying to remove a candidate not enrolled", async () => {
//       const [owner, addr1] = await ethers.getSigners();
//       const address = await addr1.getAddress();

//       expect(await election.getCandidates()).to.deep.equal([]);

//       expect(election.removeCandidate(address)).to.be.revertedWith(
//         "The candidate is not registered in this election"
//       );
//     });

//     it("Can only add candidates during registration window", async () => {
//       await network.provider.send("evm_setNextBlockTimestamp", [
//         getUnixTime(add(startDate, { days: 20 })),
//       ]);

//       const [owner] = await ethers.getSigners();

//       const ElectionFactory = await ethers.getContractFactory("Election");
//       const election = await ElectionFactory.deploy(
//         electionName,
//         await owner.getAddress(),
//         getUnixTime(startDate),
//         getUnixTime(endDate),
//         getUnixTime(votingStart),
//         getUnixTime(votingEnd)
//       );

//       await election.deployed();

//       const [addr1] = await ethers.getSigners();
//       const address = await addr1.getAddress();

//       expect(await election.getCandidates()).to.deep.equal([]);

//       expect(election.addCandidate(address)).to.be.revertedWith(
//         "Outside Registration window"
//       );

//       expect(await election.getCandidates()).to.deep.equal([]);
//     });
//   });

//   describe("Voting period", async () => {});
// });
