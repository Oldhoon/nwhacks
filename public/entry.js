document.addEventListener('DOMContentLoaded', function() {
    const titlearea = document.getElementById('journal-title');
    const textarea = document.getElementById('journal-entry');
    const charCount = document.getElementById('char-count');

    textarea.addEventListener('input', function() {
        charCount.textContent = 'Character count: ' + textarea.value.length;
    });
});

// Function to handle journal submission
function submitEntry() {
    const title = document.getElementById('journal-title').value.trim();
    const text = document.getElementById('journal-entry').value.trim(); // Get user input
    if (text) {
        localStorage.setItem('journalTitle', title); // Save title to localStorage
        localStorage.setItem('journalEntry', text); // Save text to localStorage
        window.location.href = 'submit2.html'; // Redirect to the submission page
    } else {
        alert('Please enter a journal entry before submitting!');
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('/get-entries', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const entries = await response.json();
  
      const tableBody = document.querySelector('#journal-entries tbody');
      entries.forEach((entry) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${entry.title}</td>
          <td>${new Date(entry.date).toLocaleString()}</td>
          <td>${entry.mood}</td>
          <td>${entry.score}</td>
        `;
        tableBody.appendChild(row);
      });
    } catch (err) {
      console.error('Error fetching entries:', err);
    }
  });
  
// Attach the event listener to the submit button
document.getElementById('submit-button').addEventListener('click', submitEntry);
