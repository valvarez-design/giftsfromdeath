// Connect to Socket.io server
const socket = io();

// Get elements
const userInput = document.getElementById('userInput');
const submitBtn = document.getElementById('submitBtn');
const responsesContainer = document.getElementById('responsesContainer');
const emptyState = document.getElementById('emptyState');
const modal = document.getElementById('modal');
const modalText = document.getElementById('modalText');
const closeModal = document.getElementById('closeModal');

// Store all responses locally
let responses = [];

// Positions for scattered layout (these will cycle through)
const positions = [
    { left: '10%', top: '50px', rotate: '-3deg' },
    { left: '65%', top: '30px', rotate: '2deg' },
    { left: '35%', top: '200px', rotate: '1deg' },
    { left: '75%', top: '250px', rotate: '-2deg' },
    { left: '5%', top: '350px', rotate: '3deg' },
    { left: '50%', top: '400px', rotate: '-1deg' },
    { left: '25%', top: '550px', rotate: '2deg' },
    { left: '70%', top: '500px', rotate: '-3deg' },
    { left: '15%', top: '700px', rotate: '1deg' },
    { left: '60%', top: '750px', rotate: '-2deg' }
];

// Flower positions
const flowerPositions = [
    { left: '5%', top: '20px' },
    { left: '92%', top: '100px' },
    { left: '85%', top: '450px' },
    { left: '3%', top: '600px' },
    { left: '45%', top: '800px' }
];

// Socket.io event listeners

// When connected to server, request all existing responses
socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('getResponses');
});

// Receive all responses from server
socket.on('allResponses', (allResponses) => {
    responses = allResponses;
    renderResponses();
});

// When a new response is added by any user (real-time update)
socket.on('newResponse', (response) => {
    responses.unshift(response);
    renderResponses();
});

// Add flower decorations
function addFlowers() {
    flowerPositions.forEach(pos => {
        const flower = document.createElement('div');
        flower.className = 'flower';
        flower.textContent = '✿';
        flower.style.left = pos.left;
        flower.style.top = pos.top;
        responsesContainer.appendChild(flower);
    });
}

// Render all responses
function renderResponses() {
    // Clear container
    responsesContainer.innerHTML = '';

    if (responses.length === 0) {
        responsesContainer.innerHTML = '<div class="empty-state">Responses will appear here...</div>';
        addFlowers();
        return;
    }

    // Add flowers first
    addFlowers();

    // Add response cards
    responses.forEach((response, index) => {
        const card = document.createElement('div');
        card.className = 'response-card';
        
        const text = document.createElement('p');
        text.className = 'response-text';
        text.textContent = response.text;
        
        card.appendChild(text);
        
        // Apply scattered position
        const position = positions[index % positions.length];
        card.style.left = position.left;
        card.style.top = position.top;
        card.style.transform = `rotate(${position.rotate})`;
        
        // Click to expand
        card.addEventListener('click', () => openModal(response.text));
        
        responsesContainer.appendChild(card);
    });
}

// Submit new response
function submitResponse() {
    const text = userInput.value.trim();
    
    if (text === '') {
        alert('Please enter something before sharing.');
        return;
    }
    
    // Send to server via Socket.io
    socket.emit('addResponse', { text: text });
    
    // Clear input
    userInput.value = '';
}

// Open modal to view full text
function openModal(text) {
    modalText.textContent = text;
    modal.classList.add('active');
}

// Close modal
function closeModalFunc() {
    modal.classList.remove('active');
}

// Event listeners
submitBtn.addEventListener('click', submitResponse);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitResponse();
    }
});

closeModal.addEventListener('click', closeModalFunc);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalFunc();
    }
});