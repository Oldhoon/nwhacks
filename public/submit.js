document.addEventListener('DOMContentLoaded', function() {
    const journalForm = document.getElementById('journal-form');
    const journalTextElement = document.getElementById('journal-text');
    const scoreElement = document.getElementById('score');
    const moodElement = document.getElementById('mood');

    // Retrieve the journal text from local storage
    const journalText = localStorage.getItem('journalEntry');
    journalTextElement.innerText = journalText || 'No journal entry found.';

    journalForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

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

                // Assuming the API response has `score` and `sentiment` properties
                const score = result.score;
                const mood = result.sentiment;

                // Call the displaySentiment function to update the UI with the score and mood
                displaySentiment(score, mood);

                // Set the values of the hidden input fields
                document.getElementById('hidden-journal-text').value = journalText;
                document.getElementById('hidden-score').value = score;
                document.getElementById('hidden-mood').value = mood;

                // Submit the form after updating the fields
                journalForm.submit();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
});

// Function to display sentiment and mood
function displaySentiment(score, mood) {
    // Update the sentiment score and mood in the HTML
    document.getElementById('score').innerText = score;
    document.getElementById('mood').innerText = mood;

    // Set the sentiment bar color and face emoji based on the score
    const sentimentBar = document.getElementById('sentiment-bar');
    const sentimentFace = document.getElementById('sentiment-face');

    if (score === 1) {
        sentimentBar.style.background = 'red';
        sentimentFace.innerText = '😊';  // Happy face for score 1
    } else if (score === 0) {
        sentimentBar.style.background = 'yellow';
        sentimentFace.innerText = '😐';  // Neutral face for score 0
    } else if (score === -1) {
        sentimentBar.style.background = 'green';
        sentimentFace.innerText = '😞';  // Sad face for score -1
    } else {
        // For cases where score is between -1 and 1, scale accordingly
        let position = ((score + 1) / 2) * 100;  // Normalize score to percentage
        sentimentBar.style.background = `linear-gradient(to right, green ${position}%, white ${position}%, white)`;
        sentimentFace.innerText = score > 0 ? '😊' : score < 0 ? '😞' : '😐';
    }
}