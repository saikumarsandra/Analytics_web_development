function performOperation(operator) {
  const a = Number(document.getElementById("num1").value);
  const b = Number(document.getElementById("num2").value);
  let result;

  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      result = b !== 0 ? a / b : "Error: Division by zero";
      break;
    case "%":
      result = b !== 0 ? a % b : "Error: Division by zero";
      break;
    case "++":
      result = ++a;
      break;
    case "--":
      result = --a;
      break;
    case "=":
      result = `Assignment: ${a} = ${b}`;
      break;
    case "+=":
      result = `Assignment: ${a} += ${b} => ${(a += b)}`;
      break;
    case "-=":
      result = `Assignment: ${a} -= ${b} => ${(a -= b)}`;
      break;
    case "*=":
      result = `Assignment: ${a} *= ${b} => ${(a *= b)}`;
      break;
    case "/=":
      result =
        b !== 0
          ? `Assignment: ${a} /= ${b} => ${(a /= b)}`
          : "Error: Division by zero";
      break;
    case "%=":
      result =
        b !== 0
          ? `Assignment: ${a} %= ${b} => ${(a %= b)}`
          : "Error: Division by zero";
      break;
    case "==":
      result = `${a} == ${b} => ${a == b}`;
      break;
    case "===":
      result = `${a} === ${b} => ${a === b}`;
      break;
    case "!=":
      result = `${a} != ${b} => ${a != b}`;
      break;
    case "!==":
      result = `${a} !== ${b} => ${a !== b}`;
      break;
    case ">":
      result = `${a} > ${b} => ${a > b}`;
      break;
    case "<":
      result = `${a} < ${b} => ${a < b}`;
      break;
    case ">=":
      result = `${a} >= ${b} => ${a >= b}`;
      break;
    case "<=":
      result = `${a} <= ${b} => ${a <= b}`;
      break;
    case "clear":
      result = "";
      document.getElementById("num1").value = "";
      document.getElementById("num2").value = "";
      break;
    default:
      result = "Invalid operator";
  }
  document.getElementById("result").innerHTML = `Result: ${result}`;
}
