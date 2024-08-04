import { MAX_DAILY_ACTIONS } from './pet.js';
import { COIN_COST } from './shop.js';

export function updatePetDisplay(pet) {
    document.getElementById('petName').textContent = pet.name;
    document.getElementById('petAvatar').textContent = pet.animal;
    document.getElementById('healthBar').style.width = `${pet.health}%`;
    document.getElementById('hungerBar').style.width = `${pet.hunger}%`;
    document.getElementById('happinessBar').style.width = `${pet.happiness}%`;
    document.getElementById('feedLimit').textContent = `Feeds: ${pet.feedCount}/${MAX_DAILY_ACTIONS}`;
    document.getElementById('playLimit').textContent = `Plays: ${pet.playCount}/${MAX_DAILY_ACTIONS}`;
    
    // Enable feed and play buttons when their respective counts are greater than 0
    document.getElementById('feedBtn').disabled = pet.feedCount <= 0 || pet.isDead;
    document.getElementById('playBtn').disabled = pet.playCount <= 0 || pet.isDead;

    document.getElementById('coinCount').textContent = `${Math.floor(pet.coins || 0)}/${Math.floor(pet.coinCapacity || 100)}`;
    
    // Enable buy buttons if there's enough money, regardless of current action count
    const hasEnoughCoins = (pet.coins || 0) >= COIN_COST;
    document.getElementById('buyFeedBtn').disabled = !hasEnoughCoins || pet.isDead;
    document.getElementById('buyPlayBtn').disabled = !hasEnoughCoins || pet.isDead;

    // Update pet age display
    const ageInDays = Math.floor((new Date().getTime() - pet.creationDate) / 86400000);
    document.getElementById('petAge').textContent = `Pet Age: ${ageInDays} days`;

    // Apply grey-out effect if pet is dead
    document.body.classList.toggle('pet-dead', pet.isDead);

    // Display max action message if both feed and play counts are at max
    const maxActionMessage = document.getElementById('maxActionMessage');
    if (pet.feedCount >= MAX_DAILY_ACTIONS && pet.playCount >= MAX_DAILY_ACTIONS) {
        maxActionMessage.textContent = "You've reached the maximum daily actions. Come back tomorrow for more!";
        maxActionMessage.style.display = 'block';
    } else {
        maxActionMessage.style.display = 'none';
    }
}

export function createParticle(x, y) {
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