
// Show welcome message only on the homepage
if (window.location.pathname.endsWith("index.html")) {
  alert("Welcome to Car Rental Service!");
}

// Run the code only when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!name || !email || !password) {
        alert("Please fill in all fields.");
        event.preventDefault(); // stops form from submitting
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        event.preventDefault(); // also stops submission
      }
    });
  }
});
