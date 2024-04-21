/* eslint-disable */

document.addEventListener("DOMContentLoaded", function() {
    // Get the button element
    const generateButton = document.querySelector(".generate-button");

    // Add event listener to the button
    generateButton.addEventListener("click", function(event) {
        // Prevent the default action of the button (in this case, following the link)
        event.preventDefault();

        // Log a message to the console
        console.log("Button clicked!");
        
        // You can add your additional code here to generate a new plan or perform other actions
    });
});
