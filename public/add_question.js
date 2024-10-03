document.getElementById('addQuestionForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the values from the input fields
    const question = document.getElementById('questionInput').value;
    const answer = document.getElementById('answerInput').value;

    // Create the payload
    const newQA = { question: question, answer: answer };

    // Send POST request to the server
    fetch('/api/qa', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQA),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the server
        document.getElementById('responseMessage').innerText = data.success || data.error;
        
        // Clear the input fields after submission
        document.getElementById('questionInput').value = '';
        document.getElementById('answerInput').value = '';
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
