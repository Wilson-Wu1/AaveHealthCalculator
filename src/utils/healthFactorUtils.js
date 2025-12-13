export function calculateHealthFactor(supplyTokens, borrowTokens) {
  let denominator = 0;
  let totalBorrowValue = 0;

  // Calculate denominator: ∑ (Collateral[i] × LiquidationThreshold[i])
  // liquidationThreshold is stored in basis points (e.g., 8000 for 80%), so divide by 10000 to get decimal (0.8)
  supplyTokens.forEach(token => {
    const inputAmount = token.amount || 0;
    const currentPrice = token.price || 0;
    const liquidationThreshold = (token.liquidationThreshold || 0) / 10000; // Convert basis points to decimal
    denominator += (currentPrice * inputAmount) * liquidationThreshold;
  });

  // Calculate total borrow value
  borrowTokens.forEach(token => {
    const inputAmount = token.amount || 0;
    const currentPrice = token.price || 0;
    totalBorrowValue += (currentPrice * inputAmount);
  });

  if (totalBorrowValue === 0) {
    return { value: Infinity, display: "∞", color: "green" };
  }

  let healthFactor = denominator / totalBorrowValue;
  
  if (isNaN(healthFactor)) {
    healthFactor = 0;
  }
  
  let color = "green";
  if (healthFactor <= 1.1) {
    color = "red";
  } else if (healthFactor <= 3) {
    color = "orange";
  }

  return {
    value: healthFactor,
    display: healthFactor.toFixed(2),
    color
  };
}

export function calculateNetWorth(supplyTokens, borrowTokens) {
  let supplySum = 0;
  let borrowSum = 0;

  supplyTokens.forEach(token => {
    if (token.amount > 0 && token.price > 0) {
      supplySum += token.price * token.amount;
    }
  });

  borrowTokens.forEach(token => {
    if (token.amount > 0 && token.price > 0) {
      borrowSum += token.price * token.amount;
    }
  });

  return parseFloat((supplySum - borrowSum).toFixed(2));
}

export function calculateTotalSupplied(supplyTokens) {
  return supplyTokens.reduce((sum, token) => {
    if (token.amount > 0 && token.price > 0) {
      return sum + (token.price * token.amount);
    }
    return sum;
  }, 0);
}

export function calculateTotalBorrowed(borrowTokens) {
  return borrowTokens.reduce((sum, token) => {
    if (token.amount > 0 && token.price > 0) {
      return sum + (token.price * token.amount);
    }
    return sum;
  }, 0);
}

export function calculateLTV(supplyTokens, borrowTokens) {
  const totalSupplied = calculateTotalSupplied(supplyTokens);
  if (totalSupplied === 0) {
    return 0;
  }
  const totalBorrowed = calculateTotalBorrowed(borrowTokens);
  return parseFloat(((totalBorrowed / totalSupplied) * 100).toFixed(2));
}

