// All variables
// All Html Elements
const sprite = document.querySelector(".pokemon-sprite");
const rollBtn = document.querySelector(".js-roll-btn");
const pokemonGrid = document.querySelector(".pokemon-grid");
const gridContent = document.querySelector(".grid-content");

const searchInput = document.getElementById("searchInput");
const searchIcon = document.querySelector(".search-btn");

// All script variables
const userPokemonStorage =
  JSON.parse(localStorage.getItem("pokemons")) ||
  [
    // Object will be gonna be of this type
    /* {
    name: "Bulbasaur",
    type: "grass",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    stats: {
      hp: 45,
      attack: 49,
      defense: 49,
      specialAttack: 65,
      specialDefense: 65,
      speed: 45,
    },
  }, */
  ];

// Get Pokemon Function
async function getPokemon() {
  // rolling the dice
  rollBtn.classList.add("rolling");

  try {
    const randomId = Math.floor(Math.random() * 1025) + 1;

    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon/" + randomId
    );
    if (response.ok) {
      const pokemonData = await response.json();

      await storePokemon(pokemonData); // Store pokemonData
      displayPokemon(pokemonData.sprites.front_default);
    } else {
      const errorMessage = await response.text();
      throw new Error(`Server Error: ${response.status} - ${errorMessage}`);
    }
  } catch (error) {
    return displayError(error.message);
  }
}

// ----------------- Display Error -----------------
// for error , (on fetching pokemon/networks error)
async function displayError(error) {
  // ... will make for this
}

// ----------------- Store Pokemon -----------------
// this function store pokemons after fetching them
async function storePokemon(pokemonData) {
  const pokemon = {
    name: pokemonData.name,
    type: pokemonData.types[0].type.name,
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
  userPokemonStorage.push(pokemon);
  localStorage.setItem("pokemons", JSON.stringify(userPokemonStorage));
}


//  ----------------- Display Pokemon -----------------
// display pokemon on screen and storage after fetch and store
async function displayPokemon(
  image,
  fromSearch = null
) {
  let pokemonGridData = "";
  let pokemonsToRender = userPokemonStorage; // default

  if (fromSearch === null) {


  // display on screen
  sprite.setAttribute("src", image);
  // stop rolling the dice
  rollBtn.classList.remove("rolling");


  } else {

  // this is for search
    pokemonsToRender = fromSearch;

  }

  pokemonsToRender.forEach((element) => {
    pokemonGridData += `
                            <div class="grid-item">
                        <div class="pokemon-image-container">
                            <img src="${
                              element.sprite
                            }" alt="Pokemon" class="pokemon-image">
                        </div>
                        
                        <div class="pokemon-info">
                            <div class="pokemon-identity">
                                <div class="stat-group">
                                    <p class="stat-label">Name:</p>
                                    <p class="stat-value">${
                                      element.name[0].toUpperCase() +
                                      element.name.slice(1)
                                    }</p>
                                </div>
                                <div class="stat-group">
                                    <p class="stat-label">Type:</p>
                                    <p class="stat-value">${
                                      element.type[0].toUpperCase() +
                                      element.type.slice(1)
                                    }</p>
                                </div>
                            </div>

                            <div class="pokemon-stats">
                                <div class="stat-row">
                                    <span class="stat-label">HP:</span>
                                    <span class="stat-value">${
                                      element.stats.hp
                                    }</span>
                                </div>
                                <div class="stat-row">
                                    <span class="stat-label">Attack:</span>
                                    <span class="stat-value">${
                                      element.stats.attack
                                    }</span>
                                </div>
                                <div class="stat-row">
                                    <span class="stat-label">Defense:</span>
                                    <span class="stat-value">${
                                      element.stats.defense
                                    }</span>
                                </div>
                                <div class="stat-row">
                                    <span class="stat-label">Speed:</span>
                                    <span class="stat-value">${
                                      element.stats.speed
                                    }</span>
                                </div>
                                <div class="stat-row">
                                    <span class="stat-label">Sp. Atk:</span>
                                    <span class="stat-value">${
                                      element.stats.specialAttack
                                    }</span>
                                </div>
                                <div class="stat-row">
                                    <span class="stat-label">Sp. Def:</span>
                                    <span class="stat-value">${
                                      element.stats.specialDefense
                                    }</span>
                                </div>
                            </div>
                        </div>
                    </div>
        `;
  });

  pokemonGrid.innerHTML = pokemonGridData;
}

// Search button functionality

function searchClicked() {
  const searchValue = searchInput.value.toLowerCase();
  searchInput.value = "";

  let searchResult = userPokemonStorage.filter((element) => {
    return element.name.includes(searchValue);
  });

  if (searchResult.length === 0) {
    searchResult = "No Pokemon Found!";
    pokemonGrid.innerHTML = `<p>${searchResult}</p>`;
    // pokemonGrid.style.setProperty("justify-content", "center");
    // pokemonGrid.style.setProperty("place-content", "center");   //!will aplly these to the parent  (grid-content)
    return;
  }
  console.log(searchResult);
  displayPokemon(null, searchResult);
}

searchIcon.addEventListener("click", searchClicked);
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    searchClicked();
  }
});

// onClickRoll, logic
document.querySelector(".js-roll-btn").addEventListener("click", getPokemon);

// on load, logic
window.addEventListener("load", () => {
  if (userPokemonStorage.length === 0) {
    getPokemon();
  } else {
    displayPokemon(userPokemonStorage[userPokemonStorage.length - 1].sprite);
  }
});
