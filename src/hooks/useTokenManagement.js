import { useState, useCallback } from 'react';

export function useTokenManagement() {
  const [supplyTokens, setSupplyTokens] = useState([]);
  const [borrowTokens, setBorrowTokens] = useState([]);

  const addSupplyToken = useCallback((token) => {
    setSupplyTokens(prev => {
      const exists = prev.find(t => t.symbol === token.symbol);
      if (exists) return prev;
      return [...prev, {
        symbol: token.symbol,
        amount: 0,
        price: token.price.priceInUSD,
        originalPrice: token.price.priceInUSD,
        liquidationThreshold: token.reserveLiquidationThreshold,
        borrowingEnabled: token.borrowingEnabled,
        usageAsCollateralEnabled: token.usageAsCollateralEnabled
      }];
    });
  }, []);

  const removeSupplyToken = useCallback((symbol) => {
    setSupplyTokens(prev => prev.filter(t => t.symbol !== symbol));
  }, []);

  const updateSupplyToken = useCallback((symbol, updates) => {
    setSupplyTokens(prev => prev.map(t => 
      t.symbol === symbol ? { ...t, ...updates } : t
    ));
  }, []);

  const addBorrowToken = useCallback((token) => {
    setBorrowTokens(prev => {
      const exists = prev.find(t => t.symbol === token.symbol);
      if (exists) return prev;
      return [...prev, {
        symbol: token.symbol,
        amount: 0,
        price: token.price.priceInUSD,
        originalPrice: token.price.priceInUSD,
        liquidationThreshold: token.reserveLiquidationThreshold,
        borrowingEnabled: token.borrowingEnabled,
        usageAsCollateralEnabled: token.usageAsCollateralEnabled
      }];
    });
  }, []);

  const removeBorrowToken = useCallback((symbol) => {
    setBorrowTokens(prev => prev.filter(t => t.symbol !== symbol));
  }, []);

  const updateBorrowToken = useCallback((symbol, updates) => {
    setBorrowTokens(prev => prev.map(t => 
      t.symbol === symbol ? { ...t, ...updates } : t
    ));
  }, []);

  const clearSupplyTokens = useCallback(() => {
    setSupplyTokens([]);
  }, []);

  const clearBorrowTokens = useCallback(() => {
    setBorrowTokens([]);
  }, []);

  const clearAllTokens = useCallback(() => {
    setSupplyTokens([]);
    setBorrowTokens([]);
  }, []);

  return {
    supplyTokens,
    borrowTokens,
    addSupplyToken,
    removeSupplyToken,
    updateSupplyToken,
    addBorrowToken,
    removeBorrowToken,
    updateBorrowToken,
    clearSupplyTokens,
    clearBorrowTokens,
    clearAllTokens
  };
}

