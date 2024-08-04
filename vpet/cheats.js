import { pet, savePet } from './main.js';
import { updatePetDisplay } from './ui.js';
import { MAX_DAILY_ACTIONS } from './pet.js';

function applyCheat(cheatFunction) {
    cheatFunction();
    updatePetDisplay(pet);
    savePet();
}

const cheats = {
    'h': () => {
        pet.health = 100;
        console.log('Cheat activated: Full health');
    },
    'f': () => {
        pet.hunger = 0;
        console.log('Cheat activated: Reset hunger');
    },
    'p': () => {
        pet.happiness = 100;
        pet.playCount = MAX_DAILY_ACTIONS;
        console.log('Cheat activated: Full happiness and play count');
    },
    'g': () => {
        if (pet.isDead) {
            pet.isDead = false;
            pet.health = 100;
            pet.hunger = 0;
            pet.happiness = 100;
            pet.creationDate = new Date().getTime();
            console.log('Cheat activated: Pet revived and age reset');
        }
    }
};

function initCheats() {
    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        if (cheats.hasOwnProperty(key)) {
            applyCheat(cheats[key]);
        }
    });
}

export { initCheats };