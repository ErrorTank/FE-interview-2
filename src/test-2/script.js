const transformTokenData = (rawData) =>
  rawData.reduce(
    (acc, { currency, price }) => ({
      ...acc,
      [currency]: { price },
    }),
    {}
  );

const rawTokenData = [
  { currency: "BLUR", price: 0.20811525423728813 },
  { currency: "bNEO", price: 7.1282679 },
  { currency: "BUSD", price: 0.999183113 },
  { currency: "USD", price: 1 },
  { currency: "ETH", price: 1645.9337373737374 },
  { currency: "GMX", price: 36.345114372881355 },
  { currency: "STEVMOS", price: 0.07276706779661017 },
  { currency: "LUNA", price: 0.40955638983050846 },
  { currency: "RATOM", price: 10.250918915254237 },
  { currency: "STRD", price: 0.7386553389830508 },
  { currency: "EVMOS", price: 0.06246181355932203 },
  { currency: "IBCX", price: 41.26811355932203 },
  { currency: "IRIS", price: 0.0177095593220339 },
  { currency: "ampLUNA", price: 0.49548589830508477 },
  { currency: "KUJI", price: 0.675 },
  { currency: "STOSMO", price: 0.431318 },
  { currency: "USDC", price: 0.989832 },
  { currency: "ATOM", price: 7.186657333333334 },
  { currency: "OSMO", price: 0.3772974333333333 },
  { currency: "LSI", price: 67.69661525423729 },
  { currency: "OKB", price: 42.97562059322034 },
  { currency: "OKT", price: 13.561577966101694 },
  { currency: "SWTH", price: 0.004039850455012084 },
  { currency: "USC", price: 0.994 },
  { currency: "WBTC", price: 26002.82202020202 },
  { currency: "wstETH", price: 1872.2579742372882 },
  { currency: "YieldUSD", price: 1.0290847966101695 },
  { currency: "ZIL", price: 0.01651813559322034 },
];

const tokenData = transformTokenData(rawTokenData);

const USER_BALANCE = {
  currency: "USD",
  amount: 10000,
};

const elements = {
  fromToken: document.getElementById("from-token"),
  toToken: document.getElementById("to-token"),
  fromTokenSelect: document.getElementById("from-token-select"),
  toTokenSelect: document.getElementById("to-token-select"),
  inputAmount: document.getElementById("input-amount"),
  outputAmount: document.getElementById("output-amount"),
  exchangeRate: document.getElementById("exchange-rate"),
  swapDirection: document.getElementById("swap-direction"),
  submitSwap: document.getElementById("submit-swap"),
  fromBalance: document.getElementById("from-balance"),
  resetToUsd: document.getElementById("reset-to-usd"),
};

let state = {
  fromToken: "USD",
  toToken: "USDC",
  fromAmount: "",
  toAmount: "",
  loading: false,
};

const createTokenHTML = (currency) => `
  <div class="token-content">
    <img src="./tokens/${currency}.svg" alt="${currency}" class="token-icon" />
    <span>${currency}</span>
  </div>
`;

const createTokenOptionHTML = (currency) => `
  <div class="token-option" data-value="${currency}">
    <img src="./tokens/${currency}.svg" alt="${currency}" class="token-icon" />
    ${currency}
  </div>
`;

const getSortedTokens = (tokenData) => Object.keys(tokenData).sort();

const calculateRate = (fromToken, toToken) => {
  if (!fromToken || !toToken) return 0;
  const fromPrice = tokenData[fromToken]?.price ?? 0;
  const toPrice = tokenData[toToken]?.price ?? 0;
  return toPrice ? fromPrice / toPrice : 0;
};

const formatAmount = (amount, decimals = 6) => Number(amount).toFixed(decimals);

const calculateConvertedBalance = (token) => {
  if (!token || !tokenData[token]) return 0;
  return (
    (USER_BALANCE.amount * tokenData["USD"].price) / tokenData[token].price
  );
};

const calculateExchangeAmount = (fromAmount, fromToken, toToken) => {
  if (!fromAmount || !fromToken || !toToken) return 0;
  return (fromAmount * tokenData[fromToken].price) / tokenData[toToken].price;
};

const updateTokenState = (newFromToken, newToToken) => ({
  ...state,
  fromToken: newFromToken,
  toToken: newToToken,
  fromAmount: "",
  toAmount: "",
});

const updateAmountState = (fromAmount, fromToken, toToken) => ({
  ...state,
  fromAmount,
  toAmount: calculateExchangeAmount(fromAmount, fromToken, toToken),
});

const updateBalanceDisplay = () => {
  const convertedBalance = calculateConvertedBalance(state.fromToken);
  elements.fromBalance.textContent = `Balance: ${formatAmount(
    convertedBalance
  )} ${state.fromToken}`;
};

const updateExchangeRate = () => {
  if (!state.fromToken || !state.toToken) {
    elements.exchangeRate.textContent = "-";
    return;
  }
  const rate = calculateExchangeAmount(1, state.fromToken, state.toToken);
  elements.exchangeRate.textContent = `1 ${state.fromToken} = ${formatAmount(
    rate
  )} ${state.toToken}`;
};

const updateOutputAmount = () => {
  if (!state.fromAmount) return;
  const newAmount = calculateExchangeAmount(
    state.fromAmount,
    state.fromToken,
    state.toToken
  );
  elements.outputAmount.value = formatAmount(newAmount);
};

const closeAllDropdowns = () => {
  document.querySelectorAll(".custom-select").forEach((select) => {
    select.classList.remove("open");
  });
};

const handleTokenSelect = (e, isFromToken) => {
  const option = e.target.closest(".token-option");
  if (!option) return;

  const value = option.dataset.value;
  if (!value) return;

  state = isFromToken
    ? updateTokenState(value, state.toToken)
    : updateTokenState(state.fromToken, value);

  const element = isFromToken ? elements.fromToken : elements.toToken;
  element.innerHTML = createTokenHTML(value);

  closeAllDropdowns();
  updateExchangeRate();
  updateBalanceDisplay();
  updateOutputAmount();
};

const handleInputAmountChange = (e) => {
  let value = e.target.value;

  if (!value) {
    state = updateAmountState("", state.fromToken, state.toToken);
    elements.outputAmount.value = "";
    return;
  }

  const convertedBalance = calculateConvertedBalance(state.fromToken);

  if (Number(value) > convertedBalance) {
    value = convertedBalance;
    e.target.value = value;
  }

  state = updateAmountState(value, state.fromToken, state.toToken);
  updateOutputAmount();
};

const handleSwapDirection = () => {
  state = updateTokenState(state.toToken, state.fromToken);

  elements.fromToken.innerHTML = createTokenHTML(state.fromToken);
  elements.toToken.innerHTML = createTokenHTML(state.toToken);

  elements.inputAmount.value = "";
  elements.outputAmount.value = "";

  updateBalanceDisplay();
  updateExchangeRate();
};

const handleReset = () => {
  state = updateTokenState("USD", state.toToken);
  elements.fromToken.innerHTML = createTokenHTML("USD");

  elements.inputAmount.value = "";
  elements.outputAmount.value = "";

  updateBalanceDisplay();
  updateExchangeRate();
};

const initializeTokenOptions = () => {
  const sortedTokens = getSortedTokens(tokenData);
  ["from", "to"].forEach((type) => {
    const container = document.getElementById(`${type}-token-select`);
    const dropdown = container.querySelector(".token-dropdown");
    dropdown.innerHTML = sortedTokens.map(createTokenOptionHTML).join("");
  });
};

const initializeTokenSelectors = () => {
  elements.fromToken.addEventListener("click", (e) => {
    e.stopPropagation();
    closeAllDropdowns();
    elements.fromTokenSelect.classList.add("open");
  });

  elements.toToken.addEventListener("click", (e) => {
    e.stopPropagation();
    closeAllDropdowns();
    elements.toTokenSelect.classList.add("open");
  });

  document
    .querySelectorAll("#from-token-select .token-option")
    .forEach((option) => {
      option.addEventListener("click", (e) => handleTokenSelect(e, true));
    });

  document
    .querySelectorAll("#to-token-select .token-option")
    .forEach((option) => {
      option.addEventListener("click", (e) => handleTokenSelect(e, false));
    });
};

const initializeFormControls = () => {
  elements.inputAmount.addEventListener("input", handleInputAmountChange);
  elements.swapDirection.addEventListener("click", handleSwapDirection);
  elements.resetToUsd.addEventListener("click", handleReset);

  elements.submitSwap.addEventListener("click", async () => {
    if (!state.fromToken || !state.toToken || !state.fromAmount) return;

    state = { ...state, loading: true };
    elements.submitSwap.classList.add("loading");
    elements.submitSwap.disabled = true;

    await new Promise((resolve) => setTimeout(resolve, 1500));

    state = updateTokenState(state.fromToken, state.toToken);
    state.loading = false;

    elements.submitSwap.classList.remove("loading");
    elements.submitSwap.disabled = false;
    elements.inputAmount.value = "";
    elements.outputAmount.value = "";
  });
};

const initialize = () => {
  initializeTokenOptions();
  initializeTokenSelectors();
  initializeFormControls();
  document.addEventListener("click", closeAllDropdowns);
  updateBalanceDisplay();
  updateExchangeRate();
};

initialize();
