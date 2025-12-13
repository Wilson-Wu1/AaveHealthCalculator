import { useMemo } from 'react';
import {
  calculateHealthFactor,
  calculateNetWorth,
  calculateTotalSupplied,
  calculateTotalBorrowed,
  calculateLTV
} from '../utils/healthFactorUtils';

export function useHealthFactor(supplyTokens, borrowTokens) {
  const healthFactor = useMemo(() => {
    return calculateHealthFactor(supplyTokens, borrowTokens);
  }, [supplyTokens, borrowTokens]);

  const netWorth = useMemo(() => {
    return calculateNetWorth(supplyTokens, borrowTokens);
  }, [supplyTokens, borrowTokens]);

  const totalSupplied = useMemo(() => {
    return calculateTotalSupplied(supplyTokens);
  }, [supplyTokens]);

  const totalBorrowed = useMemo(() => {
    return calculateTotalBorrowed(borrowTokens);
  }, [borrowTokens]);

  const ltv = useMemo(() => {
    return calculateLTV(supplyTokens, borrowTokens);
  }, [supplyTokens, borrowTokens]);

  return {
    healthFactor,
    netWorth,
    totalSupplied,
    totalBorrowed,
    ltv
  };
}

