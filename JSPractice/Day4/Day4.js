// today concept is functions , how to write functions , types of functions
/*Function Declaration

Function Expression

Arrow Function

Generator Function (function*)

Async Function

Async Generator Function

Method Definition (object/class methods)

Constructor Function

IIFE (pattern, not new syntax)

Function Constructor (new Function())*/

// Function Declaration
function add(a, b) {
    return a + b;
}   
console.log(add(2, 3)); // Output: 5

// Function Expression
const subtract = function(a, b) {
    return a - b;
};
console.log(subtract(5, 2)); // Output: 3
// Arrow Function
const multiply = (a, b) => a * b;
console.log(multiply(4, 3)); // Output: 12
// Generator Function
function* generatorExample() {
    yield 1;        
    yield 2;
    yield 3;
}
const gen = generatorExample();
console.log(gen.next().value); // Output: 1
console.log(gen.next().value); // Output: 2
console.log(gen.next().value); // Output: 3
// Async Function
async function asyncExample() {
    return "Hello, Async!";
}
asyncExample().then(result => console.log(result)); // Output: Hello, Async!
// Async Generator Function
async function* asyncGeneratorExample() {
    yield "First";      
    yield "Second";
    yield "Third";
}
const asyncGen = asyncGeneratorExample();
asyncGen.next().then(result => console.log(result.value)); // Output: First
asyncGen.next().then(result => console.log(result.value)); // Output: Second
asyncGen.next().then(result => console.log(result.value)); // Output: Third
// Method Definition
const obj = {      
    method() {
        return "This is a method.";
    }
};
console.log(obj.method());
// Constructor Function
function Person(name) {
    this.name = name;
}
const person1 = new Person("Alice");
console.log(person1.name);
// IIFE (Immediately Invoked Function Expression)
(function() {
    console.log("This is an IIFE.");
})();
// Function Constructor
const sumFunction = new Function('a', 'b', 'return a + b;');
console.log(sumFunction(5, 10)); // Output: 15

// eplaination of each type of function:
/*1. Function Declaration: A standard way to define a function using the function keyword. It is hoisted, meaning it can be called before its declaration in the code.

2. Function Expression: A function defined as part of an expression, often assigned to a variable. It is not hoisted, so it cannot be called before its definition.
3. Arrow Function: A concise syntax for writing functions using the => syntax. It does not have its own this context and is often used for shorter functions.
4. Generator Function: A special type of function that can pause and resume its execution, allowing it to generate a sequence of values over time using the yield keyword.
5. Async Function: A function that returns a Promise and can use the await keyword to pause execution until a Promise is resolved.
6. Async Generator Function: Combines the features of async functions and generator functions, allowing for asynchronous iteration.
7. Method Definition: A function defined as a property of an object or class, often used to define behavior for that object or class.
8. Constructor Function: A function used to create and initialize objects, typically called with the new keyword.
9. IIFE (Immediately Invoked Function Expression): A function that is defined and immediately executed, often used to create a local scope and avoid polluting the global namespace.
10. Function Constructor: A way to create a function using the Function constructor, which takes a string of code as an argument and returns a new function object. It is generally not recommended due to security and performance concerns.*/