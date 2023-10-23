# [Aave Health Calculator](https://aavehealth.org/)

**https://aavehealth.org/**

The Aave Health Calculator is a web-based tool that allows users to assess the risk level associated with their Aave positions on any supporting chain and Aave market. Users can input their wallet address, view their current health factor, and make adjustments to their position by changing token prices, adding or removing tokens from the supply or borrow side, and then view their updated health factor.

## Features

- **Chains and Markets:** Users can switch to any chain supporting the Aave protocol. Furthermore, the user can specify the Aave market version, either *Version 2* or *Version 3*. The interface, supply tokens, and borrow tokens will update accordingly with the choosen chain / Aave market.

| Supported Chains   | Aave Markets V2  | Aave Markets V3  |
|--------------------|------------------|------------------|
| Ethereum           | <span>&#10003;</span> | <span>&#10003;</span> |
| Polygon            | Needs to be fixed | <span>&#10003;</span> |
| Avalanche          | <span>&#10003;</span> | <span>&#10003;</span> |
| Optimism           || <span>&#10003;</span> |
| Arbitrum           || <span>&#10003;</span> |
| Metis              || <span>&#10003;</span> |
|Base|||

- **Address Input:** Users can input their wallet address to fetch an Aave position.

- **Token Price Adjustment:** Users can change token prices to simulate the impact on a position's health factor.

- **Token Adjustment:** Users can add or remove tokens from either the supply or borrow side of a position to see how it affects their health factor.

- **Token Liquidation Threshold Adjustment:** Users can adjust the liquidation threshold of borrowed tokens. The liquidation threshold is the percentage at which a position is defined as undercollateralised. For example, a Liquidation threshold of 80% means that if the value rises above 80% of the collateral, the position is undercollateralised and could be liquidated. Further documentation on [liquidation thresholds](https://docs.aave.com/risk/asset-risk/risk-parameters#liquidation-threshold).

- **Position Information:** Once tokens have been supplied and borrowed, the app will display three important metrics about the position.
  - **Net Worth:** The value supplied minus the value borrowed.
  - **Health Factor:** A numeric representation of the safety of the deposited assets against the borrowed assets and its underlying value. The higher the value is, the safer the state of the funds are against liquidation. If the health factor reaches 1, the liquidation of your deposits will be triggered. Further documentation on [health factor](https://docs.aave.com/faq/borrowing#what-is-the-health-factor).
  - **Liquidation To Value Ratio:** The Loan to Value (”LTV”) ratio defines the maximum amount of assets that can be borrowed with a specific collateral. It is expressed as a percentage (e.g., at LTV=75%, for every 1 ETH worth of collateral, borrowers will be able to borrow 0.75 ETH worth of the corresponding currency).


## Data Sources Used
- **The Graph for Aave Positions and Token Prices:**
  - GraphQL is used to query a user's Aave position data from The Graph. Users input their wallet address, and GraphQL queries are made to Aave's subgraph to retrieve information about their positions. This allows the app to calculate the current health factor associated with their Aave positions.
  - Aave's subgraphs also provides the app with information about the tokens that Avalanche supported by the Aave protocol, and their prices on all supported networks. 

- **Infura for Oracle Prices:**
  - Certain oracle contracts do not follow the `EACAggregator` interface and [return an error from price queries on the subgraphs](https://github.com/aave/protocol-subgraphs/issues/102). As a work-around, the app relies on Infura to access oracle prices of those tokens that return an error from Aave's subgraph.
  
  - Ethereum Oracles:
    - `wBTC` - [0x230E0321Cf38F09e247e50Afc7801EA2351fe56F](https://etherscan.io/address/0x230E0321Cf38F09e247e50Afc7801EA2351fe56F)
    - `LDO` - [0xb01e6C9af83879B8e06a092f0DD94309c0D497E4](https://etherscan.io/address/0xb01e6C9af83879B8e06a092f0DD94309c0D497E4)
    - `wstETH` - [0x8B6851156023f4f5A66F68BEA80851c3D905Ac93](https://etherscan.io/address/0x8B6851156023f4f5A66F68BEA80851c3D905Ac93)
    - `rETH` - [0x05225Cd708bCa9253789C1374e4337a019e99D56](https://etherscan.io/address/0x05225Cd708bCa9253789C1374e4337a019e99D56)
    - `cbETH` - [0x5f4d15d761528c57a5C30c43c1DAb26Fc5452731](https://etherscan.io/address/0x5f4d15d761528c57a5C30c43c1DAb26Fc5452731)
  - Polygon Oracles:
    - `wstETH` - [0xe34949A48cd2E6f5CD41753e449bd2d43993C9AC](https://polygonscan.com/address/0xe34949A48cd2E6f5CD41753e449bd2d43993C9AC)
  - Avalanche Oracles:
    - `sAVAX` - [0xc9245871D69BF4c36c6F2D15E0D68Ffa883FE1A7](https://snowtrace.io/address/0xc9245871D69BF4c36c6F2D15E0D68Ffa883FE1A7)
  - Optimism Oracles:
    - `rETH` - [0x52d5F9f884CA21C27E2100735d793C6771eAB793](https://optimistic.etherscan.io/address/0x52d5F9f884CA21C27E2100735d793C6771eAB793)
  - Arbitrum Oracles:
    - `wstETH` - [0x945fD405773973d286De54E44649cc0d9e264F78](https://arbiscan.io/address/0x945fD405773973d286De54E44649cc0d9e264F78)
    - `rETH` -  [0x04c28D6fE897859153eA753f986cc249Bf064f71](https://arbiscan.io/address/0x04c28D6fE897859153eA753f986cc249Bf064f71)

## Other Considerations
- The Aave protocol maintains a fixed value of $1 for the `GHO` stable-coin, as stated in the [GHO documentation](https://docs-gho.vercel.app/concepts/faq#:~:text=Unlike%20many%20stablecoins%2C%20the%20oracle%20price%20for%20GHO%20is%20fixed.). Consequently, the app enforces a $1 price for `GHO` unless the user explicitly modifies it. This fixed price for `GHO` is not fetched from any external data sources.
