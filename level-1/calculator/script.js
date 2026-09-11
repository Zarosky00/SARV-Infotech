const display = document.querySelector("#display");
const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const actionButtons = document.querySelectorAll("[data-action]");

const MAX_INPUT_DIGITS = 12;
let currentValue = "0";
let previousValue = null;
let selectedOperator = null;
let shouldResetDisplay = false;
let hasError = false;

function updateDisplay() {
  display.textContent = currentValue;
}

function resetAfterError() {
  if (hasError) {
    currentValue = "0";
    hasError = false;
    shouldResetDisplay = false;
  }
}

function appendNumber(number) {
  resetAfterError();

  if (shouldResetDisplay) {
    currentValue = "0";
    shouldResetDisplay = false;
  }

  const digitCount = currentValue.replace("-", "").replace(".", "").length;
  if (digitCount >= MAX_INPUT_DIGITS) {
    return;
  }

  if (currentValue === "0") {
    currentValue = number;
  } else {
    currentValue += number;
  }

  updateDisplay();
}

function appendDecimal() {
  resetAfterError();

  if (shouldResetDisplay) {
    currentValue = "0";
    shouldResetDisplay = false;
  }

  if (!currentValue.includes(".")) {
    currentValue += ".";
  }

  updateDisplay();
}

function formatResult(result) {
  const roundedResult = Number(result.toFixed(10));
  return Object.is(roundedResult, -0) ? "0" : String(roundedResult);
}

function showError(message) {
  currentValue = message;
  previousValue = null;
  selectedOperator = null;
  shouldResetDisplay = true;
  hasError = true;
  updateDisplay();
}

function calculate() {
  if (previousValue === null || selectedOperator === null) {
    return;
  }

  const previousNumber = Number(previousValue);
  const currentNumber = Number(currentValue);
  let result;

  if (selectedOperator === "+") {
    result = previousNumber + currentNumber;
  } else if (selectedOperator === "-") {
    result = previousNumber - currentNumber;
  } else if (selectedOperator === "×") {
    result = previousNumber * currentNumber;
  } else if (selectedOperator === "÷") {
    if (currentNumber === 0) {
      showError("Cannot divide by 0");
      return;
    }
    result = previousNumber / currentNumber;
  }

  currentValue = formatResult(result);
  previousValue = null;
  selectedOperator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function chooseOperator(operator) {
  resetAfterError();

  if (selectedOperator !== null && previousValue !== null && !shouldResetDisplay) {
    calculate();
  }

  previousValue = currentValue;
  selectedOperator = operator;
  shouldResetDisplay = true;
}

function clearCalculator() {
  currentValue = "0";
  previousValue = null;
  selectedOperator = null;
  shouldResetDisplay = false;
  hasError = false;
  updateDisplay();
}

function deleteLastDigit() {
  resetAfterError();

  if (shouldResetDisplay) {
    currentValue = "0";
    shouldResetDisplay = false;
  } else {
    currentValue = currentValue.slice(0, -1);
    if (currentValue === "" || currentValue === "-") {
      currentValue = "0";
    }
  }

  updateDisplay();
}

numberButtons.forEach((button) => {
  button.addEventListener("click", () => appendNumber(button.dataset.number));
});

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => chooseOperator(button.dataset.operator));
});

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.action === "clear") {
      clearCalculator();
    } else if (button.dataset.action === "delete") {
      deleteLastDigit();
    } else if (button.dataset.action === "decimal") {
      appendDecimal();
    } else if (button.dataset.action === "calculate") {
      calculate();
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (/^\d$/.test(event.key)) {
    appendNumber(event.key);
  } else if (event.key === ".") {
    appendDecimal();
  } else if (["+", "-"].includes(event.key)) {
    chooseOperator(event.key);
  } else if (event.key === "*") {
    chooseOperator("×");
  } else if (event.key === "/") {
    event.preventDefault();
    chooseOperator("÷");
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") {
    deleteLastDigit();
  } else if (event.key === "Escape") {
    clearCalculator();
  }
});

updateDisplay();
