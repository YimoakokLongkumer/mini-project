// This function runs when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

  // --- PRE-SELECT CAR ON BOOKING PAGE ---
  // This part of the script will run only on the book.html page
  if (window.location.pathname.endsWith("book.html")) {
    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    // Get the value of the 'car' parameter from the URL
    const carFromURL = urlParams.get('car');

    // If a car was passed in the URL
    if (carFromURL) {
      // Find the dropdown/select element by its ID
      const carSelectElement = document.getElementById('car');
      // Set the dropdown's value to the car from the URL
      if (carSelectElement) {
        carSelectElement.value = carFromURL;
      }
    }
  }

  // --- REGISTRATION FORM VALIDATION ---
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!name || !email || !password) {
        alert("Please fill in all fields.");
        event.preventDefault();
        return;
      }
      if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        event.preventDefault();
      }
    });
  }

  // --- LOGIN FORM VALIDATION ---
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!email || !password) {
        alert("Please enter both email and password.");
        event.preventDefault();
      }
    });
  }

});