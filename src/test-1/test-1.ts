const sumToN_A = (n: number): number => {
  if (!Number.isInteger(n) || n < 0) return 0;

  if (n > Math.sqrt(2 * Number.MAX_SAFE_INTEGER)) {
    return Number.MAX_SAFE_INTEGER;
  }

  return (n * (n + 1)) / 2;
};

const sumToN_B = (n: number): number => {
  if (!Number.isInteger(n) || n < 0) return 0;

  if (n > Number.MAX_SAFE_INTEGER) {
    return Number.MAX_SAFE_INTEGER;
  }

  let sum = 0;
  for (let i = 1; i <= n; i++) {
    if (sum > Number.MAX_SAFE_INTEGER - i) {
      return Number.MAX_SAFE_INTEGER;
    }
    sum += i;
  }
  return sum;
};

const sumToN_C = (n: number): number => {
  if (!Number.isInteger(n) || n < 0) return 0;

  const recursiveSum = (current: number, acc: number): number => {
    if (current === 0) return acc;
    if (acc > Number.MAX_SAFE_INTEGER - current) {
      return Number.MAX_SAFE_INTEGER;
    }
    return recursiveSum(current - 1, acc + current);
  };

  return recursiveSum(n, 0);
};

export { sumToN_A, sumToN_B, sumToN_C };
