const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask user for inputs - topic of class, number of students, and duration of the class
rl.question('Enter the topic to teach: ', (topic) => {
  rl.question('Enter the number of students: ', (numStudents) => {
    rl.question('Enter the duration of the class (in minutes): ', (duration) => {
      rl.close();
    });
  });
});

// Determine which category the topic falls under - math, science, art, history, english, business/finance, engineering, computer science, or foreign language
const categories = ['math', 'science', 'art', 'history', 'english', 'business/finance', 'engineering', 'computer science', 'foreign language', 'miscellaneous'];
