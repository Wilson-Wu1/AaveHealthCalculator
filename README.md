# [Aave Health Calculator](https://aavehealth.org/)

**https://aavehealth.org/**

The Aave Health Calculator is a web-based tool that allows users to assess the risk level associated with their Aave positions on any supporting chain and Aave market. Users can input their wallet address, view their current health factor, and make adjustments to their position by changing token prices, adding or removing tokens from the supply or borrow side, and then view their updated health factor.

## Features

- **Address Input:** Users can input their wallet address to fetch their Aave position data.

- **Chains and Markets:** Users can switch to any chain supporting the Aave protocol. Furthermore, the user can specify the Aave market version, either *Version 2* or *Version 3*. The interface, supply tokens, and borrow tokens will update accordingly with the choosen chain / Aave market.

| Supported Chains   | Aave Markets V2  | Aave Markets V3  |
|--------------------|------------------|------------------|
| Ethereum           | <span>&#10003;</span> | <span>&#10003;</span> |
| Polygon            | <span>&#10003;</span> | <span>&#10003;</span> |
| Avalanche          | <span>&#10003;</span> | <span>&#10003;</span> |
| Optimism           || <span>&#10003;</span> |
| Arbitrum           || <span>&#10003;</span> |
| Metis              || <span>&#10003;</span> |
|Base|||


- **Health Factor Display:** Users can view the current health factor associated with the Aave position.

- **Token Price Adjustment:** Users can change token prices to simulate the impact on their position's health factor.

- **Token Adjustment:** Users can add or remove tokens from either the supply or borrow side of a position to see how it affects their health factor.

## Data Sources Used

The Aave Health Calculator leverages The Graph and Infura to obtain user Aave positions and token prices:

- **The Graph for Aave Positions and Token Prices:**
  - GraphQL is used to query user-specific Aave position data from The Graph. Users input their wallet address, and GraphQL queries are made to Aave's subgraph to retrieve relevant information about their positions. This allows the app to calculate the current health factor associated with their Aave positions.
  - Aave's subgraph also provides the app information about which tokens are supported by the Aave protocol, and their prices on all supported networks. 

- **Infura for Oracle Prices:**
  - Certain oracle contracts do not follow the EACAggregator interface and return an error from price queries on the subgraphs https://github.com/aave/protocol-subgraphs/issues/102. As a work-around, the app relies on Infura to access oracle prices of those tokens that return an error from Aave's subgraph.
  -  An alternative is to use the WalletBalanceProvider helper contract: https://github.com/aave/interface/blob/main/src/services/WalletBalanceService.ts
