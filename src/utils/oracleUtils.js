import Web3 from 'web3';
import { MISSING_SYMBOLS } from './networkUtils';

const ORACLE_ABI = [
  {"inputs":[{"internalType":"address","name":"pegToBaseAggregatorAddress","type":"address"},{"internalType":"address","name":"assetToPegAggregatorAddress","type":"address"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[],"name":"DecimalsAboveLimit","type":"error"},
  {"inputs":[],"name":"DecimalsNotEqual","type":"error"},
  {"inputs":[],"name":"ASSET_TO_PEG","outputs":[{"internalType":"contract IChainlinkAggregator","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"DECIMALS","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"DENOMINATOR","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"MAX_DECIMALS","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"PEG_TO_BASE","outputs":[{"internalType":"contract IChainlinkAggregator","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"}
];

const ORACLE_ADDRESSES = {
  Ethereum: ['0x230E0321Cf38F09e247e50Afc7801EA2351fe56F', '0xb01e6C9af83879B8e06a092f0DD94309c0D497E4', '0x8B6851156023f4f5A66F68BEA80851c3D905Ac93', '0x05225Cd708bCa9253789C1374e4337a019e99D56','0x5f4d15d761528c57a5C30c43c1DAb26Fc5452731','0xd7b163B671f8cE9379DF8Ff7F75fA72Ccec1841c','0xF3d49021fF3bbBFDfC1992A4b09E5D1d141D044C','0x2b86D519eF34f8Adfc9349CDeA17c09Aa9dB60E2','0x7292C95A5f6A501a9c4B34f6393e221F2A0139c3','0x85968026294b8f8Fb86d6bF3Cda079f9376aD05A','0x87625393534d5C102cADB66D37201dF24cc26d4C'],
  Arbitrum: ['0x945fD405773973d286De54E44649cc0d9e264F78','0x04c28D6fE897859153eA753f986cc249Bf064f71'],
  Avalanche: ['0xc9245871D69BF4c36c6F2D15E0D68Ffa883FE1A7'],
  Polygon: ['0xe34949A48cd2E6f5CD41753e449bd2d43993C9AC'],
  Optimism: ['0x52d5F9f884CA21C27E2100735d793C6771eAB793'],
  Base: ['0xFc4d1d7a8FD1E6719e361e16044b460737F12C44','0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F','0x56038D3998C42db18ba3B821bD1EbaB9B678e657','0x8e11Ad4531826ff47BD8157a2c705F5422Da6A61','0x567E7f3DB2CD4C81872F829C8ab6556616818580','0x438e24f5FCDC1A66ecb25D19B5543e0Cb91A44D4']
};

const PROVIDER_URLS = {
  Ethereum: `https://mainnet.infura.io/v3/${process.env.REACT_APP_API_KEY}`,
  Arbitrum: `https://arbitrum-mainnet.infura.io/v3/${process.env.REACT_APP_API_KEY}`,
  Avalanche: `https://avalanche-mainnet.infura.io/v3/${process.env.REACT_APP_API_KEY}`,
  Polygon: `https://polygon-mainnet.infura.io/v3/${process.env.REACT_APP_API_KEY}`,
  Optimism: `https://optimism-mainnet.infura.io/v3/${process.env.REACT_APP_API_KEY}`,
  Base: `https://base-mainnet.infura.io/v3/${process.env.REACT_APP_API_KEY}`
};

export async function getMissingPrices(chain, aaveVersion, onError) {
  if (!ORACLE_ADDRESSES[chain] || (chain === "Polygon" && aaveVersion !== "V3")) {
    return [];
  }

  const web3ProviderUrl = PROVIDER_URLS[chain];
  if (!web3ProviderUrl) {
    return [];
  }

  const web3 = new Web3(web3ProviderUrl);
  const oracleAddresses = ORACLE_ADDRESSES[chain];
  const tempOraclePrices = [];

  for (const oracle of oracleAddresses) {
    const contract = new web3.eth.Contract(ORACLE_ABI, oracle);
    try {
      const result = await contract.methods.latestAnswer().call();
      tempOraclePrices.push((Number(result) / 100000000).toFixed(2));
    } catch (error) {
      if (onError) {
        onError(`Error fetching oracle token info. ${error.message}`);
      }
    }
  }

  return tempOraclePrices;
}

export function setMissingPrices(tokenData, oraclePrices, chain) {
  const missingSymbols = MISSING_SYMBOLS[chain] || [];
  
  if (missingSymbols.length === 0 || oraclePrices.length === 0) {
    return tokenData;
  }

  const updatedTokenData = [...tokenData];
  let oracleIndex = 0;

  for (let i = 0; i < updatedTokenData.length; i++) {
    const token = updatedTokenData[i];
    if (missingSymbols.includes(token.symbol) && oracleIndex < oraclePrices.length) {
      token.price.priceInUSD = parseFloat(oraclePrices[oracleIndex]);
      oracleIndex++;
    }
    
    // Fixed price for GHO
    if (token.symbol === 'GHO') {
      token.price.priceInUSD = 1;
    }
  }

  return updatedTokenData;
}

