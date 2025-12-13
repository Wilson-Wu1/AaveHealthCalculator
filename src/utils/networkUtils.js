import {ReactComponent as EthereumSymbol} from '../images/ethereum.svg';
import {ReactComponent as ArbitrumSymbol} from '../images/arbitrum.svg';
import {ReactComponent as OptimismSymbol} from '../images/optimism.svg';
import {ReactComponent as AvalancheSymbol} from '../images/avalanche.svg';
import {ReactComponent as PolygonSymbol} from '../images/polygon.svg';
import {ReactComponent as MetisSymbol} from '../images/metis.svg';
import {ReactComponent as BaseSymbol} from '../images/base.svg';

export const SUPPORTED_NETWORKS = ['Ethereum', 'Arbitrum', 'Optimism', 'Avalanche', 'Polygon', 'Base', 'Metis'];
export const AAVE_VERSIONS = ['V2', 'V3'];

export function getSubgraphEndpoint(networkName, version) {
  switch (networkName) {
    case "Ethereum":
      return version === "V3"
        ? `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g`
        : `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/8wR23o1zkS4gpLqLNU4kG3JHYVucqGyopL5utGxP2q1N`;
    case "Arbitrum":
      return `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/DLuE98kEb5pQNXAcKFQGQgfSQ57Xdou4jnVbAEqMfy3B`;
    case "Avalanche":
      return version === "V3"
        ? `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/2h9woxy8RTjHu1HJsCEnmzpPHFArU33avmUh4f71JpVn`
        : `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/EZvK18pMhwiCjxwesRLTg81fP33WnR6BnZe5Cvma3H1C`;
    case "Optimism":
      return `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/DSfLz8oQBUeU5atALgUFQKMTSYV9mZAVYp4noLSXAfvb`;
    case "Polygon":
      return version === "V3"
        ? `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/Co2URyXjnxaw8WqxKyVHdirq9Ahhm5vcTs4dMedAq211`
        : `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/H1Et77RZh3XEf27vkAmJyzgCME2RSFLtDS2f4PPW6CGp`;
    case "Base":
      return `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/GQFbb95cE6d8mV989mL5figjaGaKCQB3xqYrr1bRyXqF`;
    case "Metis":
      return `https://andromeda.thegraph.metis.io/subgraphs/name/aave/protocol-v3-metis`;
    default:
      return `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g`;
  }
}

export const iconComponents = {
  Ethereum: <EthereumSymbol />,
  Arbitrum: <ArbitrumSymbol />,
  Polygon: <PolygonSymbol />,
  Optimism: <OptimismSymbol />,
  Metis: <MetisSymbol />,
  Avalanche: <AvalancheSymbol />,
  Base: <BaseSymbol />
};

export const MISSING_SYMBOLS = {
  Ethereum: ['WBTC','LDO','wstETH','rETH','cbETH','ETHx','ezETH','osETH','rsETH','tETH','weETH'],
  Arbitrum: ['wstETH','rETH'],
  Avalanche: ['sAVAX'],
  Polygon: ['wstETH'],
  Optimism: ['rETH'],
  Base: ['weETH','cbBTC','wstETH','cbETH','wrsETH','ezETH']
};

