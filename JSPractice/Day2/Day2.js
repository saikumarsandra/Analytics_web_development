/* Today concept is more about condtional statements and loops in JavaScript and how its used in html and css pages. to build dynamic web applications. 
 types of conditional statements in js:
1. if statement: it is used to execute a block of code if a specified condition is true.
2. if...else statement: it is used to execute a block of code if a specified condition is true, and another block of code if the condition is false.
3. if...else if...else statement: it is used to execute a block of code if a specified condition is true, and another block of code if the condition is false, and another block of code if the condition is true.
4. switch statement: it is used to perform different actions based on different conditions.
5. ternary operator: it is a shorthand for if...else statement, it is used to assign a value to a variable based on a condition.
    types of loops in js:
1. for loop: it is used to execute a block of code a specified number of times.
2. while loop: it is used to execute a block of code as long as a specified condition is true.
3. do...while loop: it is used to execute a block of code at least once, and then repeat the loop as long as a specified condition is true.
4. for...in loop: it is used to iterate over the properties of an object.
5. for...of loop: it is used to iterate over the values of an iterable object, such as an array or a string.
6.foreach loop: it is used to execute a block of code for each element in an array.
   now let's see some examples of conditional statements and loops in js:
*/
// conditional statements
// if statement
let num = 10;
if (num > 0) {
  console.log("The number is positive.");
}

// if...else statement
let age = 18;
if (age >= 18) {
  console.log("You are an adult.");
} else {
  console.log("You are a minor.");
}
// if...else if...else statement
let score = 85;
if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else if (score >= 60) {
  console.log("Grade: D");
} else {
  console.log("Grade: F");
}
// switch statement
let day = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
][new Date().getDay()];
switch (day) {
  case "Monday":
    console.log("Today is Monday.");
    break;
  case "Tuesday":
    console.log("Today is Tuesday.");
    break;
  case "Wednesday":
    console.log("Today is Wednesday.");
    break;
  case "Thursday":
    console.log("Today is Thursday.");
    break;
  case "Friday":
    console.log("Today is Friday.");
    break;
  case "Saturday":
    console.log("Today is Saturday.");
    break;
  case "Sunday":
    console.log("Today is Sunday.");
    break;
  default:
    console.log("Invalid day.");
}
// ternary operator
let isMember = true;
let discount = isMember ? 0.1 : 0;
// loops
// for loop
for (let i = 0; i < 5; i++) {
  console.log(i);
}
// while loop
let count = 0;
while (count < 5) {
  console.log(count);

  count++;
}
// do...while loop
let num2 = 0;

do {
  console.log(num2);
  num2++;
} while (num2 < 5);
// for...in loop
let person = { name: "sai", age: 25, city: "hyderabad" };
for (let key in person) {
  console.log(key + ": " + person[key]);
}
// for...of loop
let arr = [1, 2, 3, 4, 5];
for (let value of arr) {
  console.log(value);
}
// foreach loop
let arr2 = [1, 2, 3, 4, 5];
arr2.forEach(function (value) {
  console.log(value);
});
