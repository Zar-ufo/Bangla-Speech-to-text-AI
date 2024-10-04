const paragraph = document.querySelector('.speech');
const list = document.querySelector('.chat-list');
const bnBtn = document.getElementById('bn-btn');
const enBtn = document.getElementById('en-btn');
const inputField = document.getElementById('input');
const sendBtn = document.getElementById('send-btn');
const addQuestionBtn = document.getElementById('add-question-btn');

let currentLang = 'bn-BD'; // Default language is Bengali
let qaData = []; // To store the data from the database

// Fetch the qa.json file from the Node.js server
fetch('/api/qa')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    qaData = data; // Save the questions array
    console.log('QA Data Loaded:', qaData); // Log the loaded data for debugging
  })
  .catch(error => console.error('Error loading JSON:', error));

// Helper function to create list items
const createListItem = (text, sender) => `
  <span>${sender === 'player' ? 'Player: ' : 'AI: '}${text}</span>
`;

// Initialize Speech Recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = new SpeechRecognition();
recognition.lang = currentLang;
recognition.interimResults = false;

recognition.addEventListener('result', (e) => {
  const text = e.results[0][0].transcript;
  addMessage('player', text);
  handleAIResponse(text); // Process AI response
});

recognition.addEventListener('end', recognition.start);

// Language Switch: Bengali
bnBtn.addEventListener('click', () => {
  currentLang = 'bn-BD';
  recognition.lang = currentLang;
  paragraph.innerText = 'Switched to Bengali. Start Speaking...';
  recognition.stop();
  recognition.start();
});

// Language Switch: English
enBtn.addEventListener('click', () => {
  currentLang = 'en-US';
  recognition.lang = currentLang;
  paragraph.innerText = 'Switched to English. Start Speaking...';
  recognition.stop();
  recognition.start();
});

// Start recognition
recognition.start();

// Function to add messages to the chat
function addMessage(sender, text) {
  const li = document.createElement('li');
  li.className = sender; // Set class based on sender
  li.innerHTML = createListItem(text, sender); // Use helper function
  list.appendChild(li);
  list.scrollTop = list.scrollHeight; // Scroll to the bottom
}

// Function to handle AI response based on JSON data
function handleAIResponse(text) {
  const cleanedText = text.trim().toLowerCase(); // Clean and normalize the input
  console.log('Input text:', cleanedText); // Log the cleaned input

  // Find a match in the JSON data
  const foundQA = qaData.find(qa => qa.question.trim().toLowerCase() === cleanedText);

  if (foundQA) {
    addMessage('ai', foundQA.answer);
  } else {
    addMessage('ai', "I don't have an answer for that."); // Fallback if no match is found
    console.log('No match found for:', cleanedText); // Log if no match is found
  }
}

// Handle sending messages via the input field
sendBtn.addEventListener('click', () => {
  const text = inputField.value.trim();
  if (text) {
    addMessage('player', text);
    inputField.value = '';
    handleAIResponse(text); // Simulate AI response
  }
});
