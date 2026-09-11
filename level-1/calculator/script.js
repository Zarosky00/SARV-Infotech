const display = document.querySelector("#display");
const buttons = document.querySelectorAll("button");

const MAX_DIGITS = 12;
let firstNumber = "";
let operator = "";
let resetDisplay = false;

function clearCalculator() {
  firstNumber = "";
  operator = "";
  resetDisplay = false;
  display.textContent = "0";
}

function addNumber(number) {
  if (display.textContent === "Error") {
    clearCalculator();
  }

  const digitCount = display.textContent.replace("-", "").replace(".", "").length;
  if (resetDisplay || display.textContent === "0") {
    display.textContent = number;
    resetDisplay = false;
  } else if (digitCount < MAX_DIGITS) {
    display.textContent += number;
  }
}

function addDecimal() {
  if (display.textContent === "Error") {
    clearCalculator();
  }

  if (resetDisplay) {
    display.textContent = "0";
    resetDisplay = false;
  }

  if (!display.textContent.includes(".")) {
    display.textContent += ".";
  }
}

function formatResult(result) {
  const roundedResult = Number(result.toFixed(10));
  return Object.is(roundedResult, -0) ? "0" : String(roundedResult);
}

function calculate() {
  if (firstNumber === "" || operator === "") {
    return;
  }

  const first = Number(firstNumber);
  const second = Number(display.textContent);
  let result;

  if (operator === "+") {
    result = first + second;
  } else if (operator === "-") {
    result = first - second;
  } else if (operator === "×") {
    result = first * second;
  } else if (operator === "÷") {
    if (second === 0) {
      display.textContent = "Error";
      firstNumber = "";
      operator = "";
      resetDisplay = true;
      return;
    }
    result = first / second;
  }

  display.textContent = formatResult(result);
  firstNumber = "";
  operator = "";
  resetDisplay = true;
}

function chooseOperator(nextOperator) {
  if (display.textContent === "Error") {
    clearCalculator();
  }

  if (operator !== "" && !resetDisplay) {
    calculate();
  }

  firstNumber = display.textContent;
  operator = nextOperator;
  resetDisplay = true;
}

function deleteLastDigit() {
  if (display.textContent === "Error") {
    clearCalculator();
    return;
  }

  if (resetDisplay) {
    display.textContent = "0";
    resetDisplay = false;
    return;
  }

  display.textContent = display.textContent.slice(0, -1);
  if (display.textContent === "" || display.textContent === "-") {
    display.textContent = "0";
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.number !== undefined) {
      addNumber(button.dataset.number);
    } else if (button.dataset.operator !== undefined) {
      chooseOperator(button.dataset.operator);
    } else if (button.dataset.action === "clear") {
      clearCalculator();
    } else if (button.dataset.action === "delete") {
      deleteLastDigit();
    } else if (button.dataset.action === "decimal") {
      addDecimal();
    } else if (button.dataset.action === "calculate") {
      calculate();
    }
  });
});
