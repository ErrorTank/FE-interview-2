//Anti patterns

//1. Using 'any' type:
//const getPriority = (blockchain: any): number => {
//Missing type safety could lead to runtime errors
//Solution: Use a more specific type

//2. Logic issue in sortedBalances:
// const sortedBalances = useMemo(() => {
//   return balances.filter((balance: WalletBalance) => {
//     const balancePriority = getPriority(balance.blockchain);
//     if (lhsPriority > -99) {  // lhsPriority is undefined!
//       if (balance.amount <= 0) {
//         return true;
//       }
//     }
//     return false
//   })
//Using undefined variable: lhsPriority
//Solution: Ensure that lhsPriority is defined before comparison

//3. Unused children prop and insufficient passing div prop to a custom component
// interface Props extends BoxProps {
// }
// const WalletPage: React.FC<Props> = (props: Props) => {
//   const { children, ...rest } = props;
// Solution: Remove unused children prop, the parent need to responsible for the parent div

//4. Use index as key
// formattedBalances.map((balance, index) => (
//   <WalletRow
//     className={classes.row}
//     key={`${balance.blockchain}-${balance.currency}`}
//     amount={balance.amount}
//     usdValue={balance.usdValue}
//     formattedAmount={balance.formatted}
//   />
// ));
//Using custom id as key to avoid bugs

//5. Split formattedBalances to many pure utility functions

//6. Should use React.memo to optimize performance

import React, { useMemo } from "react";

type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

interface WalletBalance {
  readonly currency: string;
  readonly amount: number;
  readonly blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
  readonly formatted: string;
  readonly usdValue: number;
}

type Props = {
  readonly classes: {
    readonly row: string;
  };
};

const BLOCKCHAIN_PRIORITIES: Readonly<Record<Blockchain, number>> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
} as const;

const removeEmptyBalances = (
  balances: readonly WalletBalance[]
): WalletBalance[] => balances.filter((balance) => balance.amount > 0);

const sortBalancesByPriority = (
  balances: readonly WalletBalance[]
): WalletBalance[] =>
  [...balances].sort(
    (a, b) =>
      (BLOCKCHAIN_PRIORITIES[b.blockchain] ?? -99) -
      (BLOCKCHAIN_PRIORITIES[a.blockchain] ?? -99)
  );

const formatBalances = (
  balances: readonly WalletBalance[],
  prices: Readonly<Record<string, number>>
): FormattedWalletBalance[] =>
  balances.map((balance) => ({
    ...balance,
    formatted: balance.amount.toFixed(),
    usdValue: prices[balance.currency] * balance.amount,
  }));

const processBalances = (
  balances: readonly WalletBalance[],
  prices: Readonly<Record<string, number>>
): FormattedWalletBalance[] => {
  const validBalances = removeEmptyBalances(balances);
  const sortedBalances = sortBalancesByPriority(validBalances);
  return formatBalances(sortedBalances, prices);
};

const WalletPage: React.FC<Props> = ({ classes }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances = useMemo(() => {
    return processBalances(balances, prices);
  }, [balances, prices]);

  return formattedBalances.map((balance) => (
    <WalletRow
      className={classes.row}
      key={`${balance.blockchain}-${balance.currency}`}
      amount={balance.amount}
      usdValue={balance.usdValue}
      formattedAmount={balance.formatted}
    />
  ));
};

export default WalletPage;
