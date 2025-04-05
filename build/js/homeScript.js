/**
 * Pokemon Home Page Application
 *
 * This TypeScript file manages the Pokemon application's home page functionality,
 * including fetching random Pokemon, storing them, and displaying them in both
 * the Gameboy display and the grid panel.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
// ==========================================
// DOM Elements
// ==========================================
/**
 * HTML Elements used in the application
 */
const sprite = document.querySelector(".pokemon-sprite");
const rollBtn = document.querySelector(".js-roll-btn");
const pokemonGrid = document.querySelector(".pokemon-grid");
const searchInput = document.getElementById("searchInput");
const searchIcon = document.querySelector(".search-btn");
// ==========================================
// Application State
// ==========================================
/**
 * Storage for user's captured Pokemon
 * Initialized from localStorage or as an empty array
 */
const userPokemonStorage = JSON.parse(localStorage.getItem("pokemons") || "[]");
// ==========================================
// Pokemon Retrieval Functions
// ==========================================
/**
 * Fetches a random Pokemon from the PokeAPI
 * Adds visual rolling effect during fetch
 * Stores and displays the Pokemon once fetched
 */
function getPokemon() {
    return __awaiter(this, void 0, void 0, function* () {
        // Apply rolling animation to the button
        rollBtn.classList.add("rolling");
        try {
            // Generate random Pokemon ID (1-1025)
            const randomId = Math.floor(Math.random() * 1025) + 1;
            // Fetch Pokemon data from API
            const response = yield fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            if (response.ok) {
                const pokemonData = yield response.json();
                // Store and display the fetched Pokemon
                yield storePokemon(pokemonData);
                displayPokemon(pokemonData.sprites.front_default);
            }
            else {
                const errorMessage = yield response.text();
                throw new Error(`Server Error: ${response.status} - ${errorMessage}`);
            }
        }
        catch (error) {
            return displayError(error.message);
        }
    });
}
/**
 * Displays error messages when Pokemon fetching fails
 * @param error - The error message to display
 */
function displayError(error) {
    return __awaiter(this, void 0, void 0, function* () {
        // Implementation for error handling functionality
        console.error("Pokemon fetch error:", error);
        // Future implementation: Show user-friendly error notification
    });
}
// ==========================================
// Pokemon Storage Functions
// ==========================================
/**
 * Transforms API data into our Pokemon format and stores it
 * @param pokemonData - Raw data from the PokeAPI
 */
function storePokemon(pokemonData) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a Pokemon object from the API data
        const pokemon = {
            name: pokemonData.name,
            type: pokemonData.types[0].type.name,
            sprite: pokemonData.sprites.front_default,
            stats: {
                hp: pokemonData.stats[0].base_stat,
                attack: pokemonData.stats[1].base_stat,
                defense: pokemonData.stats[2].base_stat,
                specialAttack: pokemonData.stats[3].base_stat,
                specialDefense: pokemonData.stats[4].base_stat,
                speed: pokemonData.stats[5].base_stat,
            },
        };
        // Add to the beginning of storage (newest first)
        userPokemonStorage.unshift(pokemon);
        // Save to localStorage
        localStorage.setItem("pokemons", JSON.stringify(userPokemonStorage));
    });
}
// ==========================================
// Display Functions
// ==========================================
/**
 * Displays Pokemon on the screen and in the grid
 * @param image - URL of the Pokemon image to display in the Gameboy screen
 * @param fromSearch - Optional filtered list of Pokemon from search
 */
function displayPokemon(image_1) {
    return __awaiter(this, arguments, void 0, function* (image, fromSearch = null) {
        let pokemonGridData = "";
        let pokemonsToRender = userPokemonStorage; // Default to all stored Pokemon
        // Handle display for main Gameboy screen (when not from search)
        if (fromSearch === null && image !== null) {
            // Update the Gameboy screen with the Pokemon image
            sprite.setAttribute("src", image);
            // Stop the rolling animation
            rollBtn.classList.remove("rolling");
        }
        else if (fromSearch !== null) {
            // Use search results for the grid
            pokemonsToRender = fromSearch;
        }
        // Generate HTML for each Pokemon in the grid
        pokemonsToRender.forEach((element) => {
            pokemonGridData += `
        <div class="grid-item">
          <div class="pokemon-image-container">
            <img src="${element.sprite}" alt="Pokemon" class="pokemon-image">
          </div>
          
          <div class="pokemon-info">
            <div class="pokemon-identity">
              <div class="stat-group">
                <p class="stat-label">Name:</p>
                <p class="stat-value">${element.name[0].toUpperCase() + element.name.slice(1)}</p>
              </div>
              <div class="stat-group">
                <p class="stat-label">Type:</p>
                <p class="stat-value">${element.type[0].toUpperCase() + element.type.slice(1)}</p>
              </div>
            </div>
  
            <div class="pokemon-stats">
              <div class="stat-row">
                <span class="stat-label">HP:</span>
                <span class="stat-value">${element.stats.hp}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Attack:</span>
                <span class="stat-value">${element.stats.attack}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Defense:</span>
                <span class="stat-value">${element.stats.defense}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Speed:</span>
                <span class="stat-value">${element.stats.speed}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Sp. Atk:</span>
                <span class="stat-value">${element.stats.specialAttack}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Sp. Def:</span>
                <span class="stat-value">${element.stats.specialDefense}</span>
              </div>
            </div>
          </div>
        </div>
      `;
        });
        // Update the grid with all Pokemon cards
        pokemonGrid.innerHTML = pokemonGridData;
    });
}
// ==========================================
// Search Functionality
// ==========================================
/**
 * Handles Pokemon search functionality
 * Filters Pokemon by name and updates the display
 */
function searchClicked() {
    // Get and normalize search input
    const searchValue = searchInput.value.toLowerCase();
    searchInput.value = ""; // Clear the input
    // Filter Pokemon by name
    let searchResult = userPokemonStorage.filter((element) => {
        return element.name.includes(searchValue);
    });
    // Handle no results case
    if (searchResult.length === 0) {
        const noResultsMessage = "No Pokemon Found!";
        pokemonGrid.innerHTML = `<p>${noResultsMessage}</p>`;
        return;
    }
    // Display the filtered Pokemon
    displayPokemon(null, searchResult);
}
// ==========================================
// Event Listeners
// ==========================================
// Search button click handler
searchIcon.addEventListener("click", searchClicked);
// Search on Enter key press
searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        searchClicked();
    }
});
// Roll button click handler
(_a = document.querySelector(".js-roll-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", getPokemon);
// Initialize the application on page load
window.addEventListener("load", () => {
    if (userPokemonStorage.length === 0) {
        // If no stored Pokemon, get a random one
        getPokemon();
    }
    else {
        // Display the most recent Pokemon
        displayPokemon(userPokemonStorage[0].sprite);
    }
});

