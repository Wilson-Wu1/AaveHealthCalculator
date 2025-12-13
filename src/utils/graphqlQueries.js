import { request } from 'graphql-request';

export const TOKEN_DATA_QUERY = `
  {
    reserves(where: {isFrozen: false}) {
      symbol
      borrowingEnabled
      usageAsCollateralEnabled
      reserveLiquidationThreshold
      price {
        priceInEth
      }
    }
  }
`;

export const USER_POSITION_QUERY = (address) => `
  {
    userReserves(where: {user: "${address}"}) {
      currentTotalDebt
      currentATokenBalance
      reserve {
        decimals
        symbol
        price {
          priceInEth
        }
      }
    }
  }
`;

export async function queryTokenData(endpoint) {
  try {
    const data = await request(endpoint, TOKEN_DATA_QUERY);
    
    // Convert priceInEth to priceInUSD
    const decimalConvert = Math.pow(10, 8);
    for (const index in data.reserves) {
      const token = data.reserves[index];
      token.price.priceInUSD = token.price.priceInEth / decimalConvert;
    }
    
    return data.reserves;
  } catch (error) {
    throw new Error(`Error fetching token info: ${error.message}`);
  }
}

export async function queryUserPosition(endpoint, address) {
  try {
    const data = await request(endpoint, USER_POSITION_QUERY(address.toLowerCase()));
    return data.userReserves;
  } catch (error) {
    throw new Error(`Error fetching user position: ${error.message}`);
  }
}

