import { useState, useCallback } from 'react';
import { queryUserPosition } from '../utils/graphqlQueries';

export function useAavePosition(endpoint) {
  const [position, setPosition] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosition = useCallback(async (address) => {
    if (!endpoint || !address) {
      setError('Endpoint and address are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await queryUserPosition(endpoint, address);
      setPosition(data);
    } catch (err) {
      setError(err.message);
      setPosition([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const clearPosition = useCallback(() => {
    setPosition([]);
    setError(null);
  }, []);

  return { position, loading, error, fetchPosition, clearPosition };
}

