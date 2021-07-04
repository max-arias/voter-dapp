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
- [x] Deploy to Test Net
- [ ] Figure out a better way for local vs test net deployments

## Dev

- Execute `yarn run serve` to run a local network and output test accounts
- Choose the `localhost` network in Metamask and import one of the private seeds from the test accounts
- Execute `yarn run deploy` to deploy our smart contract to the test network
- Update `REACT_APP_CONTRACT_ADDRESS` with the deployed contract address (this will only changes on every deploy)
- Execute `yarn start` to start the local dev server

## Deploy to the Ropsen Test net

- Create a new project in [Infura](https://infura.io/dashboard/ethereum).
- Update `INFURA_PROJECT_KEY` and `REACT_APP_INFURA_PROJECT_KEY` with your project ID.
- Update `DEPLOY_PRIVATE_KEY` with the account you want to use to deploy
- Execute `npx hardhat run scripts/deploy.js --network ropsten` to deploy to Ropsen
- Remember to update your contract address with the new deployed address

## Stack

- CRA to scaffold the React app
- SWR for data fetching
- Hardhat for Eth env/testing
- Antd for components

## Troubleshoot

- After new deployments you might get an error about the Nonce being too high.
  - To fix this, reset the test account in Metamask to reset the Nonce back to 0
