const sprite = document.querySelector('.pokemon-sprite');
async function getPokemon () {
    try {
        
        const randomId = Math.floor(Math.random() * 1025) + 1;
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + randomId);
        const pokemonData = await response.json();
        sprite.src = pokemonData.sprites.front_default;
        console.log(sprite)
        console.log(pokemonData)
}

catch (error) {
    console.log(error);
}
}
;
document.querySelector('.js-roll-btn').addEventListener('click', getPokemon);