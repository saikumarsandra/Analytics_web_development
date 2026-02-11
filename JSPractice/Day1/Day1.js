//this is my JS practice before going to build my own web application.
/* JS is a programming language that is used tp create a dynamic and interactive web experience for the HTML and CSS pages. 
  we can also use js to create web applications, mobile applications, and even desktop applications. using react js, node js, and other frameworks.
 js compiles and runs in the browser, it is a client-side scripting language. it can also run on the server-side using node js.
 js compiler is  a jit compiler, it compiles the code at runtime and executes it immediately.
 its loosly typed language, it means that we don't need to declare the data type of a variable, it can hold any type of data.
 it is an interpreted language, it means that the code is executed line by line, it does not need to be compiled before execution.
 it is invented by brendan eich in 1995, it was originally called mozilla, then it was renamed to live script, and finally it was renamed to javascript.
**********************************************************************************************************************************************************
  today concept is about variables, data types, and operators.
*******************************************************************************************************************************************************************
  variables are used to store data in a program. we can use var, let, and const to declare a variable. 
  var is the old way to declare a variable, it is function scoped and can be re-declared and updated. 
  let is the new way to declare a variable, it is block scoped and can be updated but not re-declared. 
  const is the new way to declare a constant variable, it is block scoped and cannot be updated or re-declared.

  data types are used to define the type of data that a variable can hold.
  there are 7 data types in js:
  1. string: a sequence of characters enclosed in single or double quotes. 
  2. number: a numeric value that can be an integer or a floating-point number.
  3. boolean: a logical value that can be either true or false.
  4. null: a special value that represents the absence of any value.
  5. undefined: a special value that represents the absence of a value or an uninitialized variable.
  6. object: a collection of key-value pairs that can hold any data type.
  7. symbol: a unique and immutable value that can be used as a key for object properties.
  operators are used to perform operations on variables and values.
  there are 5 types of operators in js:
  1. arithmetic operators: +, -, *, /, %, ++, -- 
  2. assignment operators: =, +=, -=, *=, /=, %= : 
  3. comparison operators: ==, ===, !=, !==, >, <, >=, <=
  4. logical operators: &&, ||, !
  5. bitwise operators: &, |, ^, ~, <<, >>, >>> ///
  // bitwise operators are used to perform bitwise operations on binary numbers 
     

  now let's see some examples of variables, data types, and operators in js:
*/
// variables

var names = "sai";
let age = 25;
const isStudent = true;

// data types

let str = "hello world"; // string
let num = 10; // number
let bool = false; // boolean
let obj = { name: "sai", age: 25 }; // object
let sym = Symbol("unique"); // symbol
// operators
let a = 10;
let b = 5;
let sum = a + b; // 15
let difference = a - b; // 5
let product = a * b; // 50
let quotient = a / b; // 2
let remainder = a % b; // 0
let increment = a++; // 10
let decrement = b--; // 5
let isEqual = a == b; // false
let isStrictEqual = a === b; // false
let isNotEqual = a != b; // true
let isStrictNotEqual = a !== b; // true
let isGreaterThan = a > b; // true
let isLessThan = a < b; // false
let isGreaterThanOrEqual = a >= b; // true
let isLessThanOrEqual = a <= b; // false
let and = a > 5 && b < 10; // true
let or = a > 5 || b < 5; // true
let not = !(a > 5); // false
let bitwiseAND = a & b; // 0
let bitwiseOR = a | b; // 15
let bitwiseXOR = a ^ b; // 15
let bitwiseNOT = ~a; // -11
let bitwiseLeftShift = a << 1;
let bitwiseRightShift = a >> 1;
let bitwiseUnsignedRightShift = a >>> 1;

// build a html and css page for above concepts and display:  them  on the page using js dynamically.

// create a div element to display the results
// accept values from user input and store them in variables return results on the page using js dynamically.
// Create main container
const container = document.createElement("div");
container.id = "appContainer";

// Center styling
container.style.maxWidth = "700px";
container.style.margin = "60px auto";
container.style.padding = "30px";
container.style.border = "1px solid #ccc";
container.style.borderRadius = "10px";
container.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
container.style.fontFamily = "Arial, sans-serif";
container.style.backgroundColor = "#f9f9f9";

document.body.appendChild(container);

// Inject HTML
container.innerHTML = `
  <h1 style="text-align:center;">JS Practice</h1>

  <h2>User Info</h2>
  <label>Name: <input type="text" id="nameInput"></label><br><br>
  <label>Age: <input type="number" id="ageInput"></label><br><br>
  <label>Are you a student? <input type="checkbox" id="isStudentInput"></label><br><br>

  <h2>Operator Inputs</h2>
  <label>Value for a: <input type="number" id="aInput"></label><br><br>
  <label>Value for b: <input type="number" id="bInput"></label><br><br>

  <button id="submitBtn" style="padding:10px 20px; background-color:#4CAF50; color:blue; border:none; border-radius:5px;">Calculate</button>

  <div id="result" style="margin-top:25px;"></div>
`;
document.getElementById("submitBtn").addEventListener("click", results);

// function to calculate results and display on the page
function results() {
  const name = document.getElementById("nameInput").value;
  const age = Number(document.getElementById("ageInput").value);
  const isStudent = document.getElementById("isStudentInput").checked;

  const a = Number(document.getElementById("aInput").value);
  const b = Number(document.getElementById("bInput").value);

  if (isNaN(a) || isNaN(b)) {
    document.getElementById("result").innerHTML =
      "<p style='color:red;'>Please enter valid numbers for a and b.</p>";
    return;
  }

  document.getElementById("result").innerHTML = `
    <h2>Results</h2>

    <h3>User Data</h3>
    <ul>
      <li>Name: ${name} (type: ${typeof name})</li>
      <li>Age: ${age} (type: ${typeof age})</li>
      <li>Student: ${isStudent} (type: ${typeof isStudent})</li>
    </ul>

    <h3>Arithmetic Operators</h3>
    <ul>
      <li>a + b = ${a + b}</li>
      <li>a - b = ${a - b}</li>
      <li>a * b = ${a * b}</li>
      <li>a / b = ${b !== 0 ? a / b : "Cannot divide by zero"}</li>
      <li>a % b = ${b !== 0 ? a % b : "Cannot mod by zero"}</li>
      <li>++a = ${a + 1}</li>
      <li>--b = ${b - 1}</li>
    </ul>

    <h3>Comparison Operators</h3>
    <ul>
      <li>a == b → ${a == b}</li>
      <li>a === b → ${a === b}</li>
      <li>a != b → ${a != b}</li>
      <li>a !== b → ${a !== b}</li>
      <li>a > b → ${a > b}</li>
      <li>a < b → ${a < b}</li>
      <li>a >= b → ${a >= b}</li>
      <li>a <= b → ${a <= b}</li>
    </ul>

    <h3>Logical Operators</h3>
    <ul>
      <li>(a > 5) && (b < 10) → ${a > 5 && b < 10}</li>
      <li>(a > 5) || (b < 5) → ${a > 5 || b < 5}</li>
      <li>!(a > 5) → ${!(a > 5)}</li>
    </ul>

    <h3>Bitwise Operators</h3>
    <ul>
      <li>a & b → ${a & b}</li>
      <li>a | b → ${a | b}</li>
      <li>a ^ b → ${a ^ b}</li>
      <li>~a → ${~a}</li>
      <li>a << 1 → ${a << 1}</li>
      <li>a >> 1 → ${a >> 1}</li>
      <li>a >>> 1 → ${a >>> 1}</li>
    </ul>
  `;
}
