document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('journal-entry');
    const charCount = document.getElementById('char-count');

    textarea.addEventListener('input', function() {
        charCount.textContent = 'Character count: ' + textarea.value.length;
    });
});

// Function to handle journal submission
function submitEntry() {
    const text = document.getElementById('journal-entry').value.trim(); // Get user input
    if (text) {
        localStorage.setItem('journalEntry', text); // Save text to localStorage
        window.location.href = 'submit2.html'; // Redirect to the submission page
    } else {
        alert('Please enter a journal entry before submitting!');
    }
}

// Attach the event listener to the submit button
document.getElementById('submit-button').addEventListener('click', submitEntry);
