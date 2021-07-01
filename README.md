# Simple voting dapp

- List all proposals
  - Filter Active
- Allow creating a proposal
- Allow voting on active proposals

## TODO

- [x] List proposals
- [x] Vote on proposals
- [ ] Update tests
- [~] Implement Styled components
- [x] Move contract creation to a hook

## Dev

- Execute `yarn run serve` to run a local network and output test accounts
- Choose the `localhost` network in Metamask and import one of the private seeds from the test accounts
- Execute `yarn run deploy` to deploy our smart contract to the test network
- Update `REACT_APP_CONTRACT_ADDRESS` with the deployed contract address (this will only changes on every deploy)
- Execute `yarn start` to start the local dev server

## Stack

- CRA to scaffold the React app
- SWR for data fetching
- Hardhat for Eth env/testing
- Antd for components

## Troubleshoot

- After testing a couple of times, you might get an error about the Nonce being too high.
  - To fix this, reset the test account in Metamask to reset the Nonce back to 0
