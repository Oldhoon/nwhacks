// Get the saved journal entry from localStorage
const journalText = localStorage.getItem('journalEntry');

// Display the journal entry
document.getElementById('journal-text').innerText = journalText || 'No journal entry found.';

// Send the text to the API and display the results
if (journalText) {
    fetch('https://api.api-ninjas.com/v1/sentiment?text=' + encodeURIComponent(journalText), {
        method: 'GET',
        headers: {
            'X-Api-Key': 'Ufcc6nUJUgAygNrritjS0A==wi2jQWj4Lne3E4pB', // Replace with your API key
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);

        // Assuming the API response has `score` and `mood` properties
        const score = result.score;
        const mood = result.sentiment;

        // Update the HTML spans with the API data
        document.getElementById('score').innerText = score;
        document.getElementById('mood').innerText = mood;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
