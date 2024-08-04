let phrases = null;

async function loadPhrases() {
    try {
        const response = await fetch('phrases.json');
        phrases = await response.json();
    } catch (error) {
        console.error('Failed to load phrases:', error);
    }
}

function getRandomPhrase(pet) {
    if (!phrases) return '';

    let phraseList = phrases.general;
    if (pet.hunger > 70) {
        phraseList = Math.random() < 0.7 ? phrases.hungry : phraseList;
    } else if (pet.happiness < 30) {
        phraseList = Math.random() < 0.7 ? phrases.playful : phraseList;
    }

    return phraseList[Math.floor(Math.random() * phraseList.length)];
}

function createSpeechBubble(phrase) {
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    bubble.textContent = phrase;
    return bubble;
}

function showSpeechBubble(pet) {
    const phrase = getRandomPhrase(pet);
    const bubble = createSpeechBubble(phrase);
    
    const petAvatar = document.getElementById('petAvatar');
    petAvatar.appendChild(bubble);

    setTimeout(() => {
        bubble.remove();
    }, 1000 + Math.random() * 1000); // Random duration between 1-2 seconds
}

function startTalking(pet) {
    function talk() {
        if (!pet.isDead) {
            showSpeechBubble(pet);
        }
        
        // Set next talk interval between 5-30 seconds
        const nextTalkDelay = 5000 + Math.random() * 25000;
        setTimeout(talk, nextTalkDelay);
    }

    talk(); // Start the cycle
}

export { loadPhrases, startTalking };