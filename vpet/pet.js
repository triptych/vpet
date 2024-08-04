const animals = ['🐶', '🐱', '🐰', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸', '🐙', '🐬', '🦄'];
const names = ['Fluffy', 'Buddy', 'Luna', 'Max', 'Bella', 'Charlie', 'Lucy', 'Bailey', 'Daisy', 'Rocky'];

export const MAX_DAILY_ACTIONS = 5;
const MAX_HUNGER_DEATH_TIME = 86400000; // 24 hours in milliseconds

export function generatePet() {
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

export function checkPetStatus(pet) {
    const currentTime = new Date().getTime();
    checkDailyReset(pet);

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

function checkDailyReset(pet) {
    const currentDate = new Date().toDateString();
    if (pet.lastActionDate !== currentDate) {
        pet.feedCount = 0;
        pet.playCount = 0;
        pet.lastActionDate = currentDate;
    }
}

export function updatePetStatus(pet) {
    checkPetStatus(pet);
    // Note: updateCoinCapacity and updatePetDisplay are called from main.js
}