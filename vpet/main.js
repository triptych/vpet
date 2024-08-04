import { generatePet, checkPetStatus, updatePetStatus, MAX_DAILY_ACTIONS } from './pet.js';
import { updatePetDisplay, createParticle } from './ui.js';
import { COIN_COST } from './shop.js';
import { encodeUnicode, decodeUnicode } from './utils.js';
import { loadPhrases, startTalking } from './talk.js';
import { initCheats } from './cheats.js';

let pet = {};

function savePet() {
    localStorage.setItem('virtualPet', JSON.stringify(pet));
}

function loadPet() {
    const savedPet = localStorage.getItem('virtualPet');
    if (savedPet) {
        pet = JSON.parse(savedPet);
        pet.coins = pet.coins || 0;
        pet.coinCapacity = pet.coinCapacity || 100;
        pet.creationDate = pet.creationDate || new Date().getTime();
        pet.lastFedDate = pet.lastFedDate || new Date().getTime();
        pet.isDead = pet.isDead || false;
    } else {
        pet = generatePet();
    }
    checkPetStatus(pet);
    updateCoinCapacity();
    updatePetDisplay(pet);
}

function updateCoinCapacity() {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - (pet.creationDate || currentTime);
    const intervalsPassed = Math.floor(timeDiff / (12 * 60 * 60 * 1000)); // 12 hours in milliseconds
    pet.coinCapacity = 100 + (intervalsPassed * 0.5);
}

function loadSharedPet() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedPetData = urlParams.get('pet');
    if (sharedPetData) {
        try {
            pet = decodeUnicode(sharedPetData);
            pet.coins = pet.coins || 0;
            pet.coinCapacity = pet.coinCapacity || 100;
            pet.creationDate = pet.creationDate || new Date().getTime();
            pet.lastFedDate = pet.lastFedDate || new Date().getTime();
            pet.isDead = pet.isDead || false;
            checkPetStatus(pet);
            updatePetDisplay(pet);
            savePet();
        } catch (error) {
            console.error('Invalid shared pet data', error);
        }
    }
}

// Event Listeners
document.getElementById('feedBtn').addEventListener('click', () => {
    if (pet.feedCount > 0 && !pet.isDead) {
        pet.hunger = Math.max(pet.hunger - 20, 0);
        pet.health = Math.min(pet.health + 10, 100);
        pet.feedCount--;
        pet.lastFedDate = new Date().getTime();
        updatePetDisplay(pet);
        savePet();
    }
});

document.getElementById('playBtn').addEventListener('click', () => {
    if (pet.playCount < MAX_DAILY_ACTIONS && !pet.isDead) {
        pet.happiness = Math.min(pet.happiness + 20, 100);
        pet.hunger = Math.min(pet.hunger + 10, 100);
        pet.playCount++;
        updatePetDisplay(pet);
        savePet();
    }
});

document.getElementById('newPetBtn').addEventListener('click', () => {
    pet = generatePet();
    updatePetDisplay(pet);
    savePet();
});

document.getElementById('shareBtn').addEventListener('click', () => {
    const petData = encodeUnicode(pet);
    const shareUrl = `${window.location.href.split('?')[0]}?pet=${petData}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Share link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});

document.querySelector('.card').addEventListener('click', function(event) {
    if (!event.target.closest('.flip-icon')) return;
    this.classList.toggle('is-flipped');
});

document.getElementById('coinEmoji').addEventListener('click', (event) => {
    if ((pet.coins || 0) < (pet.coinCapacity || 100) && !pet.isDead) {
        pet.coins = Math.min((pet.coins || 0) + 1, (pet.coinCapacity || 100));
        updatePetDisplay(pet);
        savePet();

        const rect = event.target.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        for (let i = 0; i < 10; i++) {
            createParticle(x, y);
        }
    }
});

// Prevent text selection on coin emoji
document.getElementById('coinEmoji').addEventListener('mousedown', (e) => e.preventDefault());

async function initGame() {
    await loadPhrases();
    loadPet();
    loadSharedPet();
    startTalking(pet);
    setInterval(() => updatePetStatus(pet), 10000);
    initCheats(); // Initialize cheat codes
}

initGame();

export { pet, savePet };