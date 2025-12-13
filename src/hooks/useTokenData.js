import { useState, useEffect, useCallback } from 'react';
import { queryTokenData } from '../utils/graphqlQueries';
import { getMissingPrices, setMissingPrices } from '../utils/oracleUtils';

export function useTokenData(endpoint, chain, aaveVersion) {
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTokenData = useCallback(async () => {
    if (!endpoint) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch token data from The Graph
      const data = await queryTokenData(endpoint);
      
      // Fetch missing oracle prices
      const prices = await getMissingPrices(chain, aaveVersion, (errorMsg) => {
        setError(errorMsg);
      });
      
      // Set missing prices in token data
      const updatedData = setMissingPrices(data, prices, chain);
      setTokenData(updatedData);
    } catch (err) {
      setError(err.message);
      setTokenData(null);
    } finally {
      setLoading(false);
    }
  }, [endpoint, chain, aaveVersion]);

  useEffect(() => {
    fetchTokenData();
  }, [fetchTokenData]);

  return { tokenData, loading, error, refetch: fetchTokenData };
}

