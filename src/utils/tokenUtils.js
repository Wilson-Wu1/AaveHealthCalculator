export function calculateTokenValue(amount, price) {
  if (!amount || !price || isNaN(amount) || isNaN(price)) {
    return 0;
  }
  return parseFloat((parseFloat(amount) * parseFloat(price)).toFixed(2));
}

export function formatPrice(price) {
  if (!price || isNaN(price)) {
    return "0.00";
  }
  return parseFloat(parseFloat(price).toFixed(2)).toLocaleString();
}

export function formatAmount(amount) {
  if (!amount || isNaN(amount)) {
    return "0.00";
  }
  return parseFloat(parseFloat(amount).toFixed(2)).toLocaleString();
}

export function calculatePriceChange(currentPrice, originalPrice) {
  if (!originalPrice || originalPrice === 0) {
    return { percent: 0, absolute: 0, isPositive: true };
  }
  
  const percent = ((currentPrice / originalPrice - 1) * 100);
  const absolute = currentPrice - originalPrice;
  
  return {
    percent: parseFloat(percent.toFixed(2)),
    absolute: parseFloat(Math.abs(absolute).toFixed(2)),
    isPositive: absolute >= 0
  };
}

export function getMaxSliderValue(currentPrice) {
  return currentPrice * 3;
}

export function formatPriceChange(priceChange) {
  const sign = priceChange.isPositive ? "+" : "-";
  return {
    percent: `${sign}${Math.abs(priceChange.percent).toFixed(2)}%`,
    absolute: `${sign}$${priceChange.absolute.toFixed(2)}`,
    color: priceChange.isPositive ? "green" : "red"
  };
}

