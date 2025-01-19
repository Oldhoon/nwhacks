document.addEventListener('DOMContentLoaded', function() {
    const titlearea = document.getElementById('journal-title');
    const textarea = document.getElementById('journal-entry');
    const charCount = document.getElementById('char-count');
    const currentDateElement = document.getElementById('date');
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if (currentDateElement) {
        currentDateElement.textContent = today.toLocaleDateString(undefined, options);
    }

    textarea.addEventListener('input', function() {
        charCount.textContent = 'Character count: ' + textarea.value.length;
    });

    // Speech-to-Text functionality
    const recordButton = document.getElementById('record-button');
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    let recognizing = false;

    recordButton.addEventListener('click', function() {
        if (recognizing) {
            recognition.stop();
            recordButton.textContent = 'Start Recording';
            recognizing = false;
        } else {
            recognition.start();
            recordButton.textContent = 'Stop Recording';
            recognizing = true;
        }
    });

    recognition.onresult = function(event) {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                textarea.value += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        charCount.textContent = 'Character count: ' + textarea.value.length;
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error detected: ' + event.error);
        recognizing = false;
        recordButton.textContent = 'Start Recording';
    };

    recognition.onend = function() {
        if (recognizing) {
            recognition.start();
        } else {
            recordButton.textContent = 'Start Recording';
        }
    };
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
