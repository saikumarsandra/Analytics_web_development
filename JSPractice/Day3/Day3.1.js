function findFactorial() {
  const num = parseInt(document.getElementById("num1").value);
  let factorial = 1;
  for (let i = 1; i <= num; i++) {
    factorial *= i;
  }
  document.getElementById("result").innerHTML =
    `Factorial of ${num} is ${factorial}`;
}

function generateMultiplicationTable() {
  const num = parseInt(document.getElementById("num1").value);
  let table = `<h3>Multiplication Table of ${num}</h3>`;
  for (let i = 1; i <= 10; i++) {
    table += `${num} x ${i} = ${num * i}<br>`;
  }
  document.getElementById("result").innerHTML = table;
}

function checkPrime() {
  const num = parseInt(document.getElementById("num1").value);
  let isPrime = true;
  if (num <= 1) {
    isPrime = false;
  } else {
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        isPrime = false;
        break;
      }
    }
  }
  document.getElementById("result").innerHTML =
    `${num} is ${isPrime ? "a prime number" : "not a prime number"}`;
}

function checkEvenOdd() {
  const num = parseInt(document.getElementById("num1").value);
  document.getElementById("result").innerHTML =
    `${num} is ${num % 2 === 0 ? "even" : "odd"}`;
}

function fibionacciSeries() {
  const num = parseInt(document.getElementById("num1").value);
  let a = 0,
    b = 1,
    next;
  let series = `Fibonacci Series up to ${num}: ${a} ${b} `;
  while (true) {
    next = a + b;
    if (next > num) break;
    series += `${next} `;
    a = b;
    b = next;
  }
  document.getElementById("result").innerHTML = series;
}

function checkPalindrome() {
  const num = document.getElementById("num1").value;
  const reversed = num.split("").reverse().join("");
  document.getElementById("result").innerHTML =
    `${num} is ${num === reversed ? "a palindrome" : "not a palindrome"}`;
}

function findArmstrong() {
  const num = parseInt(document.getElementById("num1").value);
  let sum = 0;
  let temp = num;
  while (temp > 0) {
    let digit = temp % 10;
    sum += digit ** 3;
    temp = Math.floor(temp / 10);
  }
  document.getElementById("result").innerHTML =
    `${num} is ${sum === num ? "an Armstrong number" : "not an Armstrong number"}`;
}

function printPatterns() {
  const num = parseInt(document.getElementById("num1").value);
  let pattern = "";
  for (let i = 1; i <= num; i++) {
    pattern += "*".repeat(i) + "<br>";
  }
  document.getElementById("result").innerHTML = pattern;
}

function clearResults() {
  document.getElementById("result").innerHTML = "";
}
