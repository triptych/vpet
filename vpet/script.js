const animals = ['🐶', '🐱', '🐰', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸', '🐙', '🐬', '🦄'];
const names = ['Fluffy', 'Buddy', 'Luna', 'Max', 'Bella', 'Charlie', 'Lucy', 'Bailey', 'Daisy', 'Rocky'];

let pet = {};
const MAX_DAILY_ACTIONS = 5;
const COIN_COST = 100;
const COIN_CAPACITY_INCREASE_RATE = 0.5; // coins per 0.5 days
const COIN_CAPACITY_INCREASE_INTERVAL = 43200000; // 12 hours in milliseconds
const MAX_HUNGER_DEATH_TIME = 86400000; // 24 hours in milliseconds

function encodeUnicode(str) {
    return encodeURIComponent(JSON.stringify(str));
}

function decodeUnicode(str) {
    return JSON.parse(decodeURIComponent(str));
}

function generatePet() {
    return {
        name: names[Math.floor(Math.random() * names.length)],
        animal: animals[Math.floor(Math.random() * animals.length)],
        health: 100,
        hunger: 0,
        happiness: 100,
        feedCount: 0,
        playCount: 0,
        lastActionDate: new Date().toDateString(),
        creationDate: new Date().getTime(),
        lastFedDate: new Date().getTime(),
        coins: 0,
        coinCapacity: 100,
        isDead: false
    };
}

function updatePetDisplay() {
    document.getElementById('petName').textContent = pet.name;
    document.getElementById('petAvatar').textContent = pet.animal;
    document.getElementById('healthBar').style.width = `${pet.health}%`;
    document.getElementById('hungerBar').style.width = `${pet.hunger}%`;
    document.getElementById('happinessBar').style.width = `${pet.happiness}%`;
    document.getElementById('feedLimit').textContent = `Feeds: ${pet.feedCount}/${MAX_DAILY_ACTIONS}`;
    document.getElementById('playLimit').textContent = `Plays: ${pet.playCount}/${MAX_DAILY_ACTIONS}`;
    
    document.getElementById('feedBtn').disabled = pet.feedCount >= MAX_DAILY_ACTIONS || pet.isDead;
    document.getElementById('playBtn').disabled = pet.playCount >= MAX_DAILY_ACTIONS || pet.isDead;

    document.getElementById('coinCount').textContent = `${Math.floor(pet.coins || 0)}/${Math.floor(pet.coinCapacity || 100)}`;
    document.getElementById('buyFeedBtn').disabled = (pet.coins || 0) < COIN_COST || pet.feedCount >= MAX_DAILY_ACTIONS || pet.isDead;
    document.getElementById('buyPlayBtn').disabled = (pet.coins || 0) < COIN_COST || pet.playCount >= MAX_DAILY_ACTIONS || pet.isDead;

    // Update pet age display
    const ageInDays = Math.floor((new Date().getTime() - pet.creationDate) / 86400000);
    document.getElementById('petAge').textContent = `Pet Age: ${ageInDays} days`;

    // Apply grey-out effect if pet is dead
    document.body.classList.toggle('pet-dead', pet.isDead);
}

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
    checkPetStatus();
    updateCoinCapacity();
    updatePetDisplay();
}

function checkPetStatus() {
    const currentTime = new Date().getTime();
    checkDailyReset();

    // Check if pet has died from hunger
    if (pet.hunger === 100 && (currentTime - pet.lastFedDate) >= MAX_HUNGER_DEATH_TIME) {
        pet.isDead = true;
    }

    if (!pet.isDead) {
        // Only update status if pet is alive
        pet.hunger = Math.min(pet.hunger + 5, 100);
        pet.happiness = Math.max(pet.happiness - 5, 0);
        pet.health = Math.max(pet.health - 2, 0);
        
        if (pet.hunger < 100) {
            pet.lastFedDate = currentTime;
        }
    }
}

function checkDailyReset() {
    const currentDate = new Date().toDateString();
    if (pet.lastActionDate !== currentDate) {
        pet.feedCount = 0;
        pet.playCount = 0;
        pet.lastActionDate = currentDate;
    }
}

function updatePetStatus() {
    checkPetStatus();
    updateCoinCapacity();
    updatePetDisplay();
    savePet();
}

function updateCoinCapacity() {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - (pet.creationDate || currentTime);
    const intervalsPassed = Math.floor(timeDiff / COIN_CAPACITY_INCREASE_INTERVAL);
    pet.coinCapacity = 100 + (intervalsPassed * COIN_CAPACITY_INCREASE_RATE);
}

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${Math.random() * 10 + 5}px`;
    particle.style.height = particle.style.width;
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 30 + 30;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    document.getElementById('particles').appendChild(particle);
    
    let start = null;
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const x = parseFloat(particle.style.left) + vx * progress / 1000;
        const y = parseFloat(particle.style.top) + vy * progress / 1000 + 0.5 * 9.8 * Math.pow(progress / 1000, 2);
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        if (progress < 500) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    }
    
    requestAnimationFrame(animate);
}

document.getElementById('feedBtn').addEventListener('click', () => {
    if (pet.feedCount < MAX_DAILY_ACTIONS && !pet.isDead) {
        pet.hunger = Math.max(pet.hunger - 20, 0);
        pet.health = Math.min(pet.health + 10, 100);
        pet.feedCount++;
        pet.lastFedDate = new Date().getTime();
        updatePetDisplay();
        savePet();
    }
});

document.getElementById('playBtn').addEventListener('click', () => {
    if (pet.playCount < MAX_DAILY_ACTIONS && !pet.isDead) {
        pet.happiness = Math.min(pet.happiness + 20, 100);
        pet.hunger = Math.min(pet.hunger + 10, 100);
        pet.playCount++;
        updatePetDisplay();
        savePet();
    }
});

document.getElementById('newPetBtn').addEventListener('click', () => {
    pet = generatePet();
    updatePetDisplay();
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
        updatePetDisplay();
        savePet();

        const rect = event.target.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        for (let i = 0; i < 10; i++) {
            createParticle(x, y);
        }
    }
});

document.getElementById('buyFeedBtn').addEventListener('click', () => {
    if ((pet.coins || 0) >= COIN_COST && pet.feedCount < MAX_DAILY_ACTIONS && !pet.isDead) {
        pet.coins -= COIN_COST;
        pet.feedCount--;
        updatePetDisplay();
        savePet();
    }
});

document.getElementById('buyPlayBtn').addEventListener('click', () => {
    if ((pet.coins || 0) >= COIN_COST && pet.playCount < MAX_DAILY_ACTIONS && !pet.isDead) {
        pet.coins -= COIN_COST;
        pet.playCount--;
        updatePetDisplay();
        savePet();
    }
});

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
            checkPetStatus();
            updatePetDisplay();
            savePet();
        } catch (error) {
            console.error('Invalid shared pet data', error);
        }
    }
}

// Prevent text selection on coin emoji
document.getElementById('coinEmoji').addEventListener('mousedown', (e) => e.preventDefault());

loadPet();
loadSharedPet();
setInterval(updatePetStatus, 10000);