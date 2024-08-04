import { pet, savePet } from './main.js';
import { updatePetDisplay } from './ui.js';
import { MAX_DAILY_ACTIONS } from './pet.js';

export const COIN_COST = 100;

document.getElementById('buyFeedBtn').addEventListener('click', () => {
    if ((pet.coins || 0) >= COIN_COST && pet.feedCount <= MAX_DAILY_ACTIONS && !pet.isDead) {
        pet.coins -= COIN_COST;
        pet.feedCount = Math.min(pet.feedCount + 1, MAX_DAILY_ACTIONS);
        updatePetDisplay(pet);
        savePet();
    }
});

document.getElementById('buyPlayBtn').addEventListener('click', () => {
    if ((pet.coins || 0) >= COIN_COST && pet.playCount < MAX_DAILY_ACTIONS && !pet.isDead) {
        pet.coins -= COIN_COST;
        pet.playCount--;
        updatePetDisplay(pet);
        savePet();
    }
});