// connect to socket.io server
const socket = io();

// get elements
const userInput = document.getElementById('userInput');
const submitBtn = document.getElementById('submitBtn');
const bubblesContainer = document.getElementById('bubblesContainer');
const counterNumber = document.getElementById('counterNumber');
const affirmation = document.getElementById('affirmation');
const whiteGlow = document.getElementById('whiteGlow');

// store all responses
let responses = [];
let activeBubbles = 0;

// audio context for synth sound
let audioContext;
let harpAudio;
let ambientOscillators = [];

// flower images for memory garden (pink and marigold variations)
const flowerImages = [
    // delicate 5-petal pink flower
    'data:image/svg+xml,%3Csvg width="80" height="80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg transform="translate(40,40)"%3E%3Cellipse cx="0" cy="-20" rx="8" ry="16" fill="%23ffc9e6" opacity="0.9"/%3E%3Cellipse cx="0" cy="-20" rx="8" ry="16" fill="%23ffc9e6" opacity="0.9" transform="rotate(72)"/%3E%3Cellipse cx="0" cy="-20" rx="8" ry="16" fill="%23ffc9e6" opacity="0.9" transform="rotate(144)"/%3E%3Cellipse cx="0" cy="-20" rx="8" ry="16" fill="%23ffc9e6" opacity="0.9" transform="rotate(216)"/%3E%3Cellipse cx="0" cy="-20" rx="8" ry="16" fill="%23ffc9e6" opacity="0.9" transform="rotate(288)"/%3E%3Ccircle cx="0" cy="0" r="6" fill="%23ffe4f2"/%3E%3C/g%3E%3C/svg%3E',
    // marigold (cempasúchil) - orange/yellow
    'data:image/svg+xml,%3Csvg width="80" height="80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg transform="translate(40,40)"%3E%3Cellipse cx="0" cy="-20" rx="8" ry="16" fill="%23ffb347" opacity="0.9"/%3E%3Cellipse cx="0" cy="-20" rx="8" ry="16" fill="%23ffb347" opacity="0.9" transform="rotate(72)"/%3E%3Cellipse cx="0" cy="-20" rx="8" ry="16" fill="%23ffb347" opacity="0.9" transform="rotate(144)"/%3E%3Cellipse cx="0" cy="-20" rx="8" ry="16" fill="%23ffb347" opacity="0.9" transform="rotate(216)"/%3E%3Cellipse cx="0" cy="-20" rx="8" ry="16" fill="%23ffb347" opacity="0.9" transform="rotate(288)"/%3E%3Ccircle cx="0" cy="0" r="6" fill="%23ffe8cc"/%3E%3C/g%3E%3C/svg%3E',
    // pink daisy style
    'data:image/svg+xml,%3Csvg width="80" height="80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg transform="translate(40,40)"%3E%3Cellipse cx="0" cy="-18" rx="6" ry="14" fill="%23ffd4eb" opacity="0.85"/%3E%3Cellipse cx="0" cy="-18" rx="6" ry="14" fill="%23ffd4eb" opacity="0.85" transform="rotate(45)"/%3E%3Cellipse cx="0" cy="-18" rx="6" ry="14" fill="%23ffd4eb" opacity="0.85" transform="rotate(90)"/%3E%3Cellipse cx="0" cy="-18" rx="6" ry="14" fill="%23ffd4eb" opacity="0.85" transform="rotate(135)"/%3E%3Cellipse cx="0" cy="-18" rx="6" ry="14" fill="%23ffd4eb" opacity="0.85" transform="rotate(180)"/%3E%3Cellipse cx="0" cy="-18" rx="6" ry="14" fill="%23ffd4eb" opacity="0.85" transform="rotate(225)"/%3E%3Cellipse cx="0" cy="-18" rx="6" ry="14" fill="%23ffd4eb" opacity="0.85" transform="rotate(270)"/%3E%3Cellipse cx="0" cy="-18" rx="6" ry="14" fill="%23ffd4eb" opacity="0.85" transform="rotate(315)"/%3E%3Ccircle cx="0" cy="0" r="5" fill="%23fff0f7"/%3E%3C/g%3E%3C/svg%3E',
    // marigold daisy style
    'data:image/svg+xml,%3Csvg width="80" height="80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg transform="translate(40,40)"%3E%3Cellipse cx="0" cy="-18" rx="6" ry="14" fill="%23ffa500" opacity="0.85"/%3E%3Cellipse cx="0" cy="-18" rx="6" ry="14" fill="%23ffa500" opacity="0.85" transform="rotate(45)"/%3E%3Cellipse cx="0" cy="-18" rx="6" ry="14" fill="%23ffa500" opacity="0.85" transform="rotate(90)"/%3E%3Cellipse cx="0" cy="-18" rx="6" ry="14" fill="%23ffa500" opacity="0.85" transform="rotate(135)"/%3E%3Cellipse cx="0" cy="-18" rx="6" ry="14" fill="%23ffa500" opacity="0.85" transform="rotate(180)"/%3E%3Cellipse cx="0" cy="-18" rx="6" ry="14" fill="%23ffa500" opacity="0.85" transform="rotate(225)"/%3E%3Cellipse cx="0" cy="-18" rx="6" ry="14" fill="%23ffa500" opacity="0.85" transform="rotate(270)"/%3E%3Cellipse cx="0" cy="-18" rx="6" ry="14" fill="%23ffa500" opacity="0.85" transform="rotate(315)"/%3E%3Ccircle cx="0" cy="0" r="5" fill="%23fff4e6"/%3E%3C/g%3E%3C/svg%3E',
    // soft cherry blossom pink
    'data:image/svg+xml,%3Csvg width="80" height="80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg transform="translate(40,40)"%3E%3Cpath d="M 0,-22 Q 6,-18 8,-12 Q 6,-6 0,-4 Q -6,-6 -8,-12 Q -6,-18 0,-22 Z" fill="%23ffb3d9" opacity="0.8"/%3E%3Cpath d="M 0,-22 Q 6,-18 8,-12 Q 6,-6 0,-4 Q -6,-6 -8,-12 Q -6,-18 0,-22 Z" fill="%23ffb3d9" opacity="0.8" transform="rotate(72)"/%3E%3Cpath d="M 0,-22 Q 6,-18 8,-12 Q 6,-6 0,-4 Q -6,-6 -8,-12 Q -6,-18 0,-22 Z" fill="%23ffb3d9" opacity="0.8" transform="rotate(144)"/%3E%3Cpath d="M 0,-22 Q 6,-18 8,-12 Q 6,-6 0,-4 Q -6,-6 -8,-12 Q -6,-18 0,-22 Z" fill="%23ffb3d9" opacity="0.8" transform="rotate(216)"/%3E%3Cpath d="M 0,-22 Q 6,-18 8,-12 Q 6,-6 0,-4 Q -6,-6 -8,-12 Q -6,-18 0,-22 Z" fill="%23ffb3d9" opacity="0.8" transform="rotate(288)"/%3E%3Ccircle cx="0" cy="0" r="4" fill="%23ffe6f2"/%3E%3C/g%3E%3C/svg%3E',
    // rounded petal pink
    'data:image/svg+xml,%3Csvg width="80" height="80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg transform="translate(40,40)"%3E%3Ccircle cx="0" cy="-16" r="9" fill="%23ffc4e1" opacity="0.85"/%3E%3Ccircle cx="0" cy="-16" r="9" fill="%23ffc4e1" opacity="0.85" transform="rotate(60)"/%3E%3Ccircle cx="0" cy="-16" r="9" fill="%23ffc4e1" opacity="0.85" transform="rotate(120)"/%3E%3Ccircle cx="0" cy="-16" r="9" fill="%23ffc4e1" opacity="0.85" transform="rotate(180)"/%3E%3Ccircle cx="0" cy="-16" r="9" fill="%23ffc4e1" opacity="0.85" transform="rotate(240)"/%3E%3Ccircle cx="0" cy="-16" r="9" fill="%23ffc4e1" opacity="0.85" transform="rotate(300)"/%3E%3Ccircle cx="0" cy="0" r="7" fill="%23fff5f9"/%3E%3C/g%3E%3C/svg%3E',
];

// initialize audio on first user interaction
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // create background harp sound (ambient loop)
        harpAudio = new Audio('harp-ambient.mp3');
        harpAudio.loop = true;
        harpAudio.volume = 0.3;
        harpAudio.play().catch(e => console.log('audio blocked:', e));
    }
}

// update ambient sound based on bubble count
function updateAmbientSound() {
    if (!audioContext) return;
    
    // clear old oscillators
    ambientOscillators.forEach(osc => {
        osc.gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        setTimeout(() => {
            osc.osc.stop();
        }, 600);
    });
    ambientOscillators = [];
    
    // add layers based on bubble count
    const layers = Math.min(Math.floor(activeBubbles / 3), 4); // max 4 layers
    
    for (let i = 0; i < layers; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        // different harmonic layers
        const frequencies = [261.63, 329.63, 392.00, 493.88]; // C, E, G, B
        osc.frequency.value = frequencies[i];
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.015, audioContext.currentTime + 1);
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.start();
        
        ambientOscillators.push({ osc, gain });
    }
}

// create ethereal dreamy pop sound
function playPopSound() {
    if (!audioContext) return;
    
    const now = audioContext.currentTime;
    
    // create multiple layered oscillators for ethereal quality
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const osc3 = audioContext.createOscillator();
    
    const gain1 = audioContext.createGain();
    const gain2 = audioContext.createGain();
    const gain3 = audioContext.createGain();
    const masterGain = audioContext.createGain();
    
    // ethereal chord (major 7th for dreamy quality)
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc2.frequency.setValueAtTime(659.25, now); // E5
    osc3.frequency.setValueAtTime(987.77, now); // B5
    
    // all descend gently
    osc1.frequency.exponentialRampToValueAtTime(392, now + 1.2);
    osc2.frequency.exponentialRampToValueAtTime(493.88, now + 1.2);
    osc3.frequency.exponentialRampToValueAtTime(739.99, now + 1.2);
    
    // soft sine waves for ethereal quality
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc3.type = 'triangle'; // slight variation
    
    // very gentle envelope - long release
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.08, now + 0.1);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.06, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    
    gain3.gain.setValueAtTime(0, now);
    gain3.gain.linearRampToValueAtTime(0.04, now + 0.2);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    
    masterGain.gain.setValueAtTime(0.25, now);
    
    // connect everything
    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);
    
    gain1.connect(masterGain);
    gain2.connect(masterGain);
    gain3.connect(masterGain);
    
    masterGain.connect(audioContext.destination);
    
    // play
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    
    osc1.stop(now + 1.5);
    osc2.stop(now + 1.5);
    osc3.stop(now + 1.5);
}

// update counter
function updateCounter() {
    counterNumber.textContent = responses.length;
}

// socket.io event listeners
socket.on('connect', () => {
    console.log('connected to server');
    socket.emit('getResponses');
});

// receive all responses from server
socket.on('allResponses', (allResponses) => {
    responses = allResponses;
    updateCounter();
    renderBubbles();
});

// when a new response is added
socket.on('newResponse', (response) => {
    responses.unshift(response);
    updateCounter();
    createBubble(response);
});

// create a single bubble
function createBubble(response) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // random starting position across the screen
    const startX = Math.random() * (window.innerWidth - 120);
    const startY = Math.random() * (window.innerHeight - 300) + 150; // avoid top input area
    bubble.style.left = startX + 'px';
    bubble.style.top = startY + 'px';
    
    // gentle floating animation (very slow)
    const duration = 40 + Math.random() * 20; // 40-60 seconds
    bubble.style.animationDuration = duration + 's';
    
    // click to pop
    bubble.addEventListener('click', () => popBubble(bubble, response, startX, startY));
    
    bubblesContainer.appendChild(bubble);
    
    activeBubbles++;
    updateAmbientSound();
}

// pop bubble and reveal text, then leave flower
function popBubble(bubble, response, x, y) {
    // init audio on first interaction
    initAudio();
    
    // play pop sound
    playPopSound();
    
    // get bubble position
    const rect = bubble.getBoundingClientRect();
    
    // add popping animation
    bubble.classList.add('popping');
    
    // create particle burst effect
    createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    
    // show text where bubble was
    setTimeout(() => {
        const revealedText = document.createElement('div');
        revealedText.className = 'revealed-text';
        revealedText.textContent = response.text;
        revealedText.style.left = (rect.left + rect.width / 2) + 'px';
        revealedText.style.top = (rect.top + rect.height / 2) + 'px';
        revealedText.style.transform = 'translate(-50%, -50%)';
        
        bubblesContainer.appendChild(revealedText);
        
        // remove bubble
        bubble.remove();
        activeBubbles--;
        updateAmbientSound();
        
        // remove text after animation
        setTimeout(() => {
            revealedText.remove();
            
            // leave a flower in the memory garden
            createFlowerMemory(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }, 4000);
    }, 200);
}

// create flower in memory garden
function createFlowerMemory(x, y) {
    const flower = document.createElement('div');
    flower.className = 'flower-memory';
    flower.style.left = x + 'px';
    flower.style.top = y + 'px';
    flower.style.transform = 'translate(-50%, -50%)';
    
    const img = document.createElement('img');
    // pick random flower from array
    img.src = flowerImages[Math.floor(Math.random() * flowerImages.length)];
    img.alt = 'memory flower';
    
    flower.appendChild(img);
    bubblesContainer.appendChild(flower);
}

// create particle burst effect
function createParticles(x, y) {
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // random direction
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = 40 + Math.random() * 30;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        bubblesContainer.appendChild(particle);
        
        // remove after animation
        setTimeout(() => particle.remove(), 1000);
    }
}

// render all existing bubbles
function renderBubbles() {
    // clear existing bubbles
    bubblesContainer.innerHTML = '';
    activeBubbles = 0;
    
    // create bubbles for each response with staggered timing
    responses.forEach((response, index) => {
        setTimeout(() => {
            createBubble(response);
        }, index * 500); // stagger by 500ms
    });
}

// submit new response
function submitResponse() {
    const text = userInput.value.trim();
    
    if (text === '') {
        alert('please enter something before releasing');
        return;
    }
    
    // init audio on first interaction
    initAudio();
    
    // send to server
    socket.emit('addResponse', { text: text });
    
    // clear input
    userInput.value = '';
    
    // show white glow and affirmation message
    if (whiteGlow && affirmation) {
        whiteGlow.classList.add('show');
        affirmation.classList.add('show');
        
        setTimeout(() => {
            whiteGlow.classList.remove('show');
            affirmation.classList.remove('show');
        }, 1000); // 1 second
    }
}

// event listeners
submitBtn.addEventListener('click', submitResponse);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitResponse();
    }
});