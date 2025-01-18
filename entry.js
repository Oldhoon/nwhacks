// Function to handle journal submission
function submitEntry() {
    const text = document.getElementById('journal-entry').value; // Get user input
    localStorage.setItem('journalEntry', text); // Save text to localStorage
    window.location.href = 'submit.html'; // Redirect to the submission page
}

// Attach the event listener to the submit button
document.getElementById('submit-button').addEventListener('click', submitEntry);
