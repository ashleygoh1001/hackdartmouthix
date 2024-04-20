const readline = require('readline');

// Scanner
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt the user to enter the number of students
rl.question("Please enter the number of students: ", function(userInput) {
  // Convert the input to a number
  let numStudents = parseInt(userInput);

  // Check if the input is a valid number
  if (isNaN(numStudents)) {
    console.log("Invalid input. Please enter a valid number.");
  } else {
    console.log("Number of students: " + numStudents);
  }

  // Close the readline interface
  rl.close();
});
