// API URL
const API_URL = "https://api.exchangerate-api.com/v4/latest/";

const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");
const amount = document.getElementById("amount");
const result = document.getElementById("result");
const convertBtn = document.getElementById("convertBtn");

// Fetch exchange rate data and populate the dropdowns with flags
async function populateCurrencies() {
  try {
    const response = await fetch(API_URL + "USD"); // Fetch USD as base currency
    const data = await response.json();
    const currencies = Object.keys(data.rates);

/**
    * Creates and appends currency options to select elements.
    * @example
    * currency('USD')
    * Appends 'USD' currency option to both select elements.
    * @param {string} currency - The currency code to be added as options.
    * @returns {void} No return value.
    * @description
    *   - Appends the same currency as an option to two separate select elements, `fromCurrency` and `toCurrency`.
    *   - Utilizes `document.createElement` to generate option elements dynamically.
    */
    currencies.forEach(currency => {
      const option1 = document.createElement("option");
      const option2 = document.createElement("option");
      option1.value = option2.value = currency;
      option1.textContent = option2.textContent = currency;
      fromCurrency.appendChild(option1);
      toCurrency.appendChild(option2);
    });

    // Set default values
    fromCurrency.value = "USD";
    toCurrency.value = "EUR";

    // Update flags
    updateFlag(fromCurrency, fromFlag);
    updateFlag(toCurrency, toFlag);
  } catch (error) {
    console.error("Error fetching currency data:", error);
    alert("Failed to fetch currency data. Please try again later.");
  }
}

// Update flag when currency changes
function updateFlag(currencyDropdown, flagElement) {
  const countryCode = getCountryCode(currencyDropdown.value);
  flagElement.src = `https://flagcdn.com/w40/${countryCode}.png`;
}

// Convert currency
async function convertCurrency() {
  const from = fromCurrency.value;
  const to = toCurrency.value;
  const amountValue = amount.value;

  if (!amountValue || amountValue <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  try {
    const response = await fetch(API_URL + from);
    const data = await response.json();
    const rate = data.rates[to];
    const convertedAmount = (amountValue * rate).toFixed(2);

    result.textContent = `${amountValue} ${from} = ${convertedAmount} ${to}`;
  } catch (error) {
    console.error("Error during conversion:", error);
    alert("Conversion failed. Please try again.");
  }
}

// Get country code from currency code
function getCountryCode(currency) {
  const currencyToCountry = {
    USD: "us",
    EUR: "eu",
    GBP: "gb",
    INR: "in",
    JPY: "jp",
    CNY: "cn",
    AUD: "au",
    CAD: "ca",
    // Add more mappings as needed
  };
  return currencyToCountry[currency] || currency.slice(0, 2).toLowerCase();
}

// Event Listeners
fromCurrency.addEventListener("change", () => updateFlag(fromCurrency, fromFlag));
toCurrency.addEventListener("change", () => updateFlag(toCurrency, toFlag));
document.addEventListener("DOMContentLoaded", populateCurrencies);
convertBtn.addEventListener("click", convertCurrency);
