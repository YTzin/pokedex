let currentPokemonId = null;

document.addEventListener("DOMContentLoaded", () => {
  const MAX_POKEMONS = 151;
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);

  if (id < 1 || id > MAX_POKEMONS) {
    return (window.location.href = "./index.html");
  }

  currentPokemonId = id;
  loadPokemon(id);
});

async function loadPokemon(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(res => res.json()),
    ]);

    if (currentPokemonId === id) {
      displayPokemonDetails(pokemon);
      const flavorText = getEnglishFlavorText(pokemonSpecies);
      document.querySelector(".body3-fonts.pokemon-description").textContent = flavorText;

      const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map(sel => document.querySelector(sel));
      leftArrow.removeEventListener("click", navigatePokemon);
      rightArrow.removeEventListener("click", navigatePokemon);

      if (id !== 1) {
        leftArrow.addEventListener("click", () => navigatePokemon(id - 1));
      }
      if (id !== 151) {
        rightArrow.addEventListener("click", () => navigatePokemon(id + 1));
      }

      window.history.pushState({}, "", `./pokemon-detail.html?id=${id}`);
    }

    return true;
  } catch (error) {
    console.error("An error occurred while fetching Pokémon data:", error);
    return false;
  }
}

async function navigatePokemon(id) {
  currentPokemonId = id;
  await loadPokemon(id);
}

const typeColors = {
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

function setElementStyles(elements, cssProperty, value) {
  elements.forEach(element => element.style[cssProperty] = value);
}

function rgbaFromHex(hexColor) {
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  ].join(", ");
}

function setTypeBackgroundColor(pokemon) {
  const typeWrapper = document.querySelector(".power-wrapper");
  typeWrapper.innerHTML = ""; // Limpa o conteúdo existente

  pokemon.types.forEach(({ type }) => {
    const typeName = type.name;
    const color = typeColors[typeName];

    if (!color) {
      console.warn(`Color not defined for type: ${typeName}`);
      return;
    }

    const typeElement = createAndAppendElement(typeWrapper, "p", {
      className: `body3-fonts type ${typeName}`,
      textContent: capitalizeFirstLetter(typeName),
    });

    typeElement.style.backgroundColor = color; // Define a cor de fundo do tipo
    typeElement.style.color = '#fff'; // Define a cor do texto para contraste
    console.log(`Type ${typeName} color applied: ${color}`);
  });

  // Aplicar cor principal ao fundo
  const mainType = pokemon.types[0].type.name;
  const mainColor = typeColors[mainType];

  const detailMainElement = document.querySelector(".detail-main");
  setElementStyles([detailMainElement], "backgroundColor", mainColor);
  setElementStyles([detailMainElement], "borderColor", mainColor);

  setElementStyles(
    document.querySelectorAll(".power-wrapper > p"),
    "backgroundColor",
    mainColor
  );

  setElementStyles(
    document.querySelectorAll(".stats-wrap p.stats"),
    "color",
    mainColor
  );

  setElementStyles(
    document.querySelectorAll(".stats-wrap .progress-bar"),
    "color",
    mainColor
  );

  const rgbaColor = rgbaFromHex(mainColor);
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    .stats-wrap .progress-bar::-webkit-progress-bar {
        background-color: rgba(${rgbaColor}, 0.5);
    }
    .stats-wrap .progress-bar::-webkit-progress-value {
        background-color: ${mainColor};
    }
  `;
  document.head.appendChild(styleTag);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function createAndAppendElement(parent, tag, options = {}) {
  const element = document.createElement(tag);
  Object.keys(options).forEach(key => {
    element[key] = options[key];
  });
  parent.appendChild(element);
  return element;
}

function displayPokemonDetails(pokemon) {
  const { name, id, types, weight, height, abilities, stats } = pokemon;
  const capitalizePokemonName = capitalizeFirstLetter(name);

  document.querySelector("title").textContent = capitalizePokemonName;

  const detailMainElement = document.querySelector(".detail-main");
  detailMainElement.classList.add(name.toLowerCase());

  document.querySelector(".name-wrap .name").textContent = capitalizePokemonName;

  document.querySelector(".pokemon-id-wrap .body2-fonts").textContent = `#${String(id).padStart(3, "0")}`;

  const imageElement = document.querySelector(".detail-img-wrapper img");
  imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
  imageElement.alt = name;

  const typeWrapper = document.querySelector(".power-wrapper");
  typeWrapper.innerHTML = "";
  types.forEach(({ type }) => {
    createAndAppendElement(typeWrapper, "p", {
      className: `body3-fonts type ${type.name}`,
      textContent: capitalizeFirstLetter(type.name),
    });
  });

  document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight").textContent = `${weight / 10}kg`;
  document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height").textContent = `${height / 10}m`;

  const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move");
  abilities.forEach(({ ability }) => {
    createAndAppendElement(abilitiesWrapper, "p", {
      className: "body3-fonts",
      textContent: ability.name,
    });
  });

  const statsWrapper = document.querySelector(".stats-wrapper");
  statsWrapper.innerHTML = "";

  const statNameMapping = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SATK",
    "special-defense": "SDEF",
    speed: "SPD",
  };

  stats.forEach(({ stat, base_stat }) => {
    const statDiv = document.createElement("div");
    statDiv.className = "stats-wrap";
    statsWrapper.appendChild(statDiv);

    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts stats",
      textContent: statNameMapping[stat.name],
    });

    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts",
      textContent: String(base_stat).padStart(3, "0"),
    });

    createAndAppendElement(statDiv, "progress", {
      className: "progress-bar",
      value: base_stat,
      max: 100,
    });
  });

  setTypeBackgroundColor(pokemon);
}

function getEnglishFlavorText(pokemonSpecies) {
  for (let entry of pokemonSpecies.flavor_text_entries) {
    if (entry.language.name === "en") {
      let flavor = entry.flavor_text.replace(/\f/g, " ");
      return flavor;
    }
  }
  return "";
}

function getTypeClass(type) {
  switch(type) {
      case 'fire': return 'type-fire';
      case 'grass': return 'type-grass';
      case 'poison': return 'type-poison';
      // Adicione mais casos conforme necessário
      default: return '';
  }
}

// Exemplo de uso
document.querySelector('.pokemon-type').classList.add(getTypeClass('poison'));
