// All variables
// All Html Elements
const sprite = document.querySelector(".pokemon-sprite");
const rollBtn = document.querySelector(".js-roll-btn");

// All script variables
const userPokemonStorage = JSON.parse(localStorage.getItem("pokemons")) || [{
    name: "Bulbasaur",
    type: "grass",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    stats: { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45 }
}];

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

      storePokemon(pokemonData); // Store pokemonData
      

    } else {
      const errorMessage = await response.text();
      throw new Error(`Server Error: ${response.status} - ${errorMessage}`);
    }
  } catch (error) {
    return displayError(error.message);
  }
}

// for error , (on fetching pokemon/networks error)
async function displayError(error) {
    // ... will make for this 
}

// this function store pokemons after fetching them 
async function storePokemon(pokemonData) {

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
            speed: pokemonData.stats[5].base_stat
        }
    };
    console.log(userPokemonStorage)
    userPokemonStorage.push(pokemon);
    localStorage.setItem("pokemons", JSON.stringify(userPokemonStorage));
    displayPokemon(pokemon.sprite);

}


// display pokemon on screen and storage after fetch and store 
async function displayPokemon (image)  {
    // display on screen
    sprite.setAttribute("src", image);

    // start rolling the dice
    rollBtn.classList.remove("rolling");

    // display on storage

};    





// onClickRoll , logic
document.querySelector(".js-roll-btn").addEventListener("click", getPokemon);
