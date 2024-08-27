const pokeContainer = document.querySelector('#pokeContainer');
const pokemonCount = 151;
const colors = {
    fire: '#F08030',    
    grass: '#78C850',   
    electric: '#F8D030', 
    water: '#6890F0',   
    ground: '#E0C068',  
    rock: '#B8A038',    
    fairy: '#EE99AC',   
    poison: '#A040A0',  
    bug: '#A8B820',     
    dragon: '#7038F8',  
    psychic: '#F85888', 
    flying: '#A890F0',  
    fighting: '#C03028', 
    normal: '#A8A878'
};

const mainTypes = Object.keys(colors);

const fetchPokemons = async () => {
    for (let i = 1; i <= pokemonCount; i++) {
        await getPokemon(i);
    }
};

const getPokemon = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const resp = await fetch(url);
    const data = await resp.json();
    createPokemonCard(data);
};

const createPokemonCard = (poke) => {
    const card = document.createElement('div');
    card.classList.add("pokemon");

    const name = poke.name[0].toUpperCase() + poke.name.slice(1);
    const id = poke.id.toString().padStart(3, '0');

    const pokeTypes = poke.types.map(type => type.type.name);
    const type = mainTypes.find(type => pokeTypes.indexOf(type) > -1);
    const color = colors[type];

    card.style.backgroundColor = color;
    
    const typeHTML = pokeTypes.map(type => `<span class="type type-${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</span>`).join(' ');

    const pokemonInnerHTML = `
    <div class="pokemon">
            <div class="imgContainer">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png" alt="${name}">
            </div>
            <div class="info">
                <span class="number">#${id}</span>
                <h3 class="name">${name}</h3>
                <small class="type">${typeHTML}</small>
            </div>
    </div>
    `;

    card.innerHTML = pokemonInnerHTML;

    // Adiciona um evento de clique ao card
    card.addEventListener('click', () => {
        window.location.href = `pokemon-detail.html?id=${poke.id}`;
    });

    pokeContainer.appendChild(card);
}


fetchPokemons();
