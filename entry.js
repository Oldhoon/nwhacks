document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('journal-entry');
    const charCount = document.getElementById('char-count');

    textarea.addEventListener('input', function() {
        charCount.textContent = 'Character count : ${textarea.value.length}';
    });
});
