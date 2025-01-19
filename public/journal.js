document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/get-entries', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const entries = await response.json();
        const tableBody = document.getElementById('journal-entries');

        entries.forEach((entry) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.title}</td>
                <td>${entry.mood || 'N/A'}</td>
                <td>${entry.score || 'N/A'}</td>
                <td>${new Date(entry.date).toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.error('Error fetching journal entries:', err);
    }
});
