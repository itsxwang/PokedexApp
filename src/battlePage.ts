/**
 * Pokemon Battle Page Application
 * 
 * This TypeScript file manages the Pokemon battle functionality,
 * including Pokemon selection, battle mechanics, and visual effects.
 */

// ==========================================
// Type Definitions
// ==========================================

interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

interface Pokemon {
  name: string;
  type: string;
  sprite: string;
  stats: PokemonStats;
}

interface BattlePokemon extends Pokemon {
  currentHp: number;
  maxHp: number;
  isSelected: boolean;
}

// ==========================================
// DOM Elements
// ==========================================

const selectedPokemon1 = document.querySelector(".selectedPokemon1 img") as HTMLImageElement;
const selectedPokemon2 = document.querySelector(".selectedPokemon2 img") as HTMLImageElement;
const battleStartBtn = document.querySelector(".battleStartBtn") as HTMLButtonElement;
const chooseLeftPokemon = document.querySelector(".chooseLeftPokemon") as HTMLElement;
const chooseRightPokemon = document.querySelector(".chooseRightPokemon") as HTMLElement;
const startBattleEffect = document.querySelector(".startBattleEffect") as HTMLElement;
const battleArena = document.querySelector(".battleArena") as HTMLElement;

// ==========================================
// Application State
// ==========================================

let userPokemonStorage: Pokemon[] = JSON.parse(localStorage.getItem("pokemons") || "[]");
let battlePokemon1: BattlePokemon | null = null;
let battlePokemon2: BattlePokemon | null = null;
let battleInProgress = false;
let battleLog: string[] = [];

// ==========================================
// Utility Functions
// ==========================================

function getTypeColor(type: string): string {
  const typeColors: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
  };
  return typeColors[type.toLowerCase()] || '#68A090';
}

function getTypeEffectiveness(attackerType: string, defenderType: string): number {
  const effectiveness: { [key: string]: { [key: string]: number } } = {
    fire: { grass: 2, ice: 2, bug: 2, steel: 2, water: 0.5, fire: 0.5, rock: 0.5, dragon: 0.5 },
    water: { fire: 2, ground: 2, rock: 2, grass: 0.5, water: 0.5, dragon: 0.5 },
    grass: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5, steel: 0.5 },
    electric: { water: 2, flying: 2, electric: 0.5, grass: 0.5, dragon: 0.5, ground: 0 },
    // Add more type matchups as needed
  };
  
  return effectiveness[attackerType.toLowerCase()]?.[defenderType.toLowerCase()] || 1;
}

function calculateDamage(attacker: BattlePokemon, defender: BattlePokemon): number {
  const baseDamage = Math.floor((attacker.stats.attack / defender.stats.defense) * 50);
  const typeEffectiveness = getTypeEffectiveness(attacker.type, defender.type);
  const randomFactor = 0.85 + Math.random() * 0.3; // 85% to 115%
  
  return Math.max(1, Math.floor(baseDamage * typeEffectiveness * randomFactor));
}

// ==========================================
// Display Functions
// ==========================================

function displayPokemonSelection(): void {
  if (userPokemonStorage.length === 0) {
    chooseLeftPokemon.innerHTML = '<p class="no-pokemon">No Pokemon available! Go catch some first!</p>';
    chooseRightPokemon.innerHTML = '<p class="no-pokemon">No Pokemon available! Go catch some first!</p>';
    return;
  }

  let leftPokemonHtml = '<h3 class="selection-title">Choose Player 1 Pokemon</h3>';
  let rightPokemonHtml = '<h3 class="selection-title">Choose Player 2 Pokemon</h3>';

  userPokemonStorage.forEach((pokemon, index) => {
    const pokemonCard = `
      <div class="pokemon-selection-card" data-index="${index}" data-player="1">
        <div class="pokemon-image-container">
          <img src="${pokemon.sprite}" alt="${pokemon.name}" class="pokemon-image">
        </div>
        <div class="pokemon-info">
          <h4 class="pokemon-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h4>
          <div class="pokemon-type" style="background-color: ${getTypeColor(pokemon.type)}">${pokemon.type.toUpperCase()}</div>
          <div class="pokemon-stats-mini">
            <span>HP: ${pokemon.stats.hp}</span>
            <span>ATK: ${pokemon.stats.attack}</span>
            <span>DEF: ${pokemon.stats.defense}</span>
          </div>
        </div>
      </div>
    `;
    
    leftPokemonHtml += pokemonCard;
    rightPokemonHtml += pokemonCard.replace('data-player="1"', 'data-player="2"');
  });

  chooseLeftPokemon.innerHTML = leftPokemonHtml;
  chooseRightPokemon.innerHTML = rightPokemonHtml;

  // Add event listeners for Pokemon selection
  addSelectionEventListeners();
}

function addSelectionEventListeners(): void {
  const selectionCards = document.querySelectorAll('.pokemon-selection-card');
  
  selectionCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const index = parseInt(target.dataset.index!);
      const player = target.dataset.player!;
      
      selectPokemon(index, player);
    });
  });
}

function selectPokemon(index: number, player: string): void {
  const pokemon = userPokemonStorage[index];
  
  if (player === "1") {
    battlePokemon1 = {
      ...pokemon,
      currentHp: pokemon.stats.hp,
      maxHp: pokemon.stats.hp,
      isSelected: true
    };
    selectedPokemon1.src = pokemon.sprite;
    selectedPokemon1.alt = pokemon.name;
    
    // Update visual selection
    document.querySelectorAll('[data-player="1"]').forEach(card => card.classList.remove('selected'));
    document.querySelector(`[data-player="1"][data-index="${index}"]`)?.classList.add('selected');
  } else {
    battlePokemon2 = {
      ...pokemon,
      currentHp: pokemon.stats.hp,
      maxHp: pokemon.stats.hp,
      isSelected: true
    };
    selectedPokemon2.src = pokemon.sprite;
    selectedPokemon2.alt = pokemon.name;
    
    // Update visual selection
    document.querySelectorAll('[data-player="2"]').forEach(card => card.classList.remove('selected'));
    document.querySelector(`[data-player="2"][data-index="${index}"]`)?.classList.add('selected');
  }
  
  updateBattleButton();
}

function updateBattleButton(): void {
  if (battlePokemon1 && battlePokemon2) {
    battleStartBtn.textContent = "START BATTLE!";
    battleStartBtn.classList.add('ready');
    battleStartBtn.disabled = false;
  } else {
    battleStartBtn.textContent = "Select Pokemon";
    battleStartBtn.classList.remove('ready');
    battleStartBtn.disabled = true;
  }
}

// ==========================================
// Battle System
// ==========================================

async function startBattle(): Promise<void> {
  if (!battlePokemon1 || !battlePokemon2 || battleInProgress) return;
  
  battleInProgress = true;
  battleLog = [];
  
  // Hide selection panels and show battle interface
  chooseLeftPokemon.style.display = 'none';
  chooseRightPokemon.style.display = 'none';
  
  // Create battle interface
  createBattleInterface();
  
  // Start battle animation
  startBattleEffect.classList.add('battle-active');
  
  // Battle loop
  while (battlePokemon1.currentHp > 0 && battlePokemon2.currentHp > 0) {
    await battleTurn();
    await sleep(2000);
  }
  
  // End battle
  endBattle();
}

function createBattleInterface(): void {
  const battleInterface = document.createElement('div');
  battleInterface.className = 'battle-interface';
  battleInterface.innerHTML = `
    <div class="battle-status">
      <div class="pokemon-status player1">
        <div class="status-header">
          <h3>${battlePokemon1!.name.toUpperCase()}</h3>
          <div class="type-badge" style="background-color: ${getTypeColor(battlePokemon1!.type)}">${battlePokemon1!.type.toUpperCase()}</div>
        </div>
        <div class="hp-bar-container">
          <div class="hp-bar">
            <div class="hp-fill player1-hp" style="width: 100%"></div>
          </div>
          <span class="hp-text">${battlePokemon1!.currentHp}/${battlePokemon1!.maxHp}</span>
        </div>
      </div>
      
      <div class="pokemon-status player2">
        <div class="status-header">
          <h3>${battlePokemon2!.name.toUpperCase()}</h3>
          <div class="type-badge" style="background-color: ${getTypeColor(battlePokemon2!.type)}">${battlePokemon2!.type.toUpperCase()}</div>
        </div>
        <div class="hp-bar-container">
          <div class="hp-bar">
            <div class="hp-fill player2-hp" style="width: 100%"></div>
          </div>
          <span class="hp-text">${battlePokemon2!.currentHp}/${battlePokemon2!.maxHp}</span>
        </div>
      </div>
    </div>
    
    <div class="battle-log">
      <div class="log-content"></div>
    </div>
  `;
  
  document.querySelector('.belowSection')!.appendChild(battleInterface);
}

async function battleTurn(): Promise<void> {
  // Determine turn order based on speed
  const pokemon1Speed = battlePokemon1!.stats.speed;
  const pokemon2Speed = battlePokemon2!.stats.speed;
  
  let firstAttacker: BattlePokemon;
  let secondAttacker: BattlePokemon;
  let firstDefender: BattlePokemon;
  let secondDefender: BattlePokemon;
  
  if (pokemon1Speed >= pokemon2Speed) {
    firstAttacker = battlePokemon1!;
    firstDefender = battlePokemon2!;
    secondAttacker = battlePokemon2!;
    secondDefender = battlePokemon1!;
  } else {
    firstAttacker = battlePokemon2!;
    firstDefender = battlePokemon1!;
    secondAttacker = battlePokemon1!;
    secondDefender = battlePokemon2!;
  }
  
  // First attack
  await performAttack(firstAttacker, firstDefender);
  
  // Second attack (if defender is still alive)
  if (firstDefender.currentHp > 0) {
    await sleep(1000);
    await performAttack(secondAttacker, secondDefender);
  }
}

async function performAttack(attacker: BattlePokemon, defender: BattlePokemon): Promise<void> {
  const damage = calculateDamage(attacker, defender);
  defender.currentHp = Math.max(0, defender.currentHp - damage);
  
  // Add to battle log
  const effectiveness = getTypeEffectiveness(attacker.type, defender.type);
  let effectivenessText = '';
  if (effectiveness > 1) effectivenessText = " It's super effective!";
  else if (effectiveness < 1) effectivenessText = " It's not very effective...";
  
  const logMessage = `${attacker.name.toUpperCase()} attacks ${defender.name.toUpperCase()} for ${damage} damage!${effectivenessText}`;
  addToBattleLog(logMessage);
  
  // Update HP bars
  updateHPBars();
  
  // Attack animation
  const attackerElement = attacker === battlePokemon1 ? selectedPokemon1 : selectedPokemon2;
  const defenderElement = defender === battlePokemon1 ? selectedPokemon1 : selectedPokemon2;
  
  attackerElement.classList.add('attacking');
  defenderElement.classList.add('taking-damage');
  
  await sleep(500);
  
  attackerElement.classList.remove('attacking');
  defenderElement.classList.remove('taking-damage');
  
  if (defender.currentHp === 0) {
    defenderElement.classList.add('fainted');
    addToBattleLog(`${defender.name.toUpperCase()} fainted!`);
  }
}

function updateHPBars(): void {
  const player1HpBar = document.querySelector('.player1-hp') as HTMLElement;
  const player2HpBar = document.querySelector('.player2-hp') as HTMLElement;
  const player1HpText = document.querySelector('.player1 .hp-text') as HTMLElement;
  const player2HpText = document.querySelector('.player2 .hp-text') as HTMLElement;
  
  if (player1HpBar && battlePokemon1) {
    const hpPercentage = (battlePokemon1.currentHp / battlePokemon1.maxHp) * 100;
    player1HpBar.style.width = `${hpPercentage}%`;
    player1HpText.textContent = `${battlePokemon1.currentHp}/${battlePokemon1.maxHp}`;
    
    // Change color based on HP
    if (hpPercentage > 50) player1HpBar.style.backgroundColor = '#4CAF50';
    else if (hpPercentage > 25) player1HpBar.style.backgroundColor = '#FF9800';
    else player1HpBar.style.backgroundColor = '#F44336';
  }
  
  if (player2HpBar && battlePokemon2) {
    const hpPercentage = (battlePokemon2.currentHp / battlePokemon2.maxHp) * 100;
    player2HpBar.style.width = `${hpPercentage}%`;
    player2HpText.textContent = `${battlePokemon2.currentHp}/${battlePokemon2.maxHp}`;
    
    // Change color based on HP
    if (hpPercentage > 50) player2HpBar.style.backgroundColor = '#4CAF50';
    else if (hpPercentage > 25) player2HpBar.style.backgroundColor = '#FF9800';
    else player2HpBar.style.backgroundColor = '#F44336';
  }
}

function addToBattleLog(message: string): void {
  battleLog.push(message);
  const logContent = document.querySelector('.log-content') as HTMLElement;
  if (logContent) {
    logContent.innerHTML = battleLog.map(log => `<p>${log}</p>`).join('');
    logContent.scrollTop = logContent.scrollHeight;
  }
}

function endBattle(): void {
  battleInProgress = false;
  
  let winner: BattlePokemon;
  if (battlePokemon1!.currentHp > 0) {
    winner = battlePokemon1!;
  } else {
    winner = battlePokemon2!;
  }
  
  addToBattleLog(`🏆 ${winner.name.toUpperCase()} WINS THE BATTLE! 🏆`);
  
  // Show restart button
  setTimeout(() => {
    const restartBtn = document.createElement('button');
    restartBtn.className = 'restart-battle-btn';
    restartBtn.textContent = 'Battle Again';
    restartBtn.addEventListener('click', restartBattle);
    
    document.querySelector('.battle-interface')!.appendChild(restartBtn);
  }, 2000);
}

function restartBattle(): void {
  // Reset battle state
  battlePokemon1 = null;
  battlePokemon2 = null;
  battleInProgress = false;
  battleLog = [];
  
  // Clear images
  selectedPokemon1.src = '';
  selectedPokemon2.src = '';
  
  // Remove battle interface
  const battleInterface = document.querySelector('.battle-interface');
  if (battleInterface) {
    battleInterface.remove();
  }
  
  // Show selection panels
  chooseLeftPokemon.style.display = 'block';
  chooseRightPokemon.style.display = 'block';
  
  // Reset battle effect
  startBattleEffect.classList.remove('battle-active');
  
  // Reset button
  updateBattleButton();
  
  // Redisplay Pokemon selection
  displayPokemonSelection();
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ==========================================
// Event Listeners
// ==========================================

battleStartBtn.addEventListener('click', startBattle);

// ==========================================
// Initialize Application
// ==========================================

window.addEventListener('load', () => {
  displayPokemonSelection();
  updateBattleButton();
});