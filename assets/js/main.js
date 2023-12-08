const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modalPokemon = document.getElementById('modalPokemon')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <button data-bs-toggle="modal" data-bs-target="#exampleModal" type="button" class="pokemon ${pokemon.type}" id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <div class="types">
                    ${pokemon.types.map((type) => `<div class="type ${type}">${type}</div>`).join('')}
                </div>
                <div style="margin-left:40px">
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </div>
        </button>
    `
}

function mountModal(type, pokemonInfo, abilitiesConcat, genderRate, eggGroup, types){
    console.log(types);
    const percentRateFemale = (genderRate/8)*100;
    const percentRateMale = 100 - percentRateFemale;
    return `<div class="modal-body ${type}" style="padding: 0;">
    <div class="modal-top" >
        <div class="pokemon-name" >
            <h3 style="text-transform: capitalize;">${pokemonInfo.name}</h3>
            <span class="types"> 
                ${types.map((type) => `<div class="teste ${type.type.name}">${type.type.name}</div>`).join('')}
            </span>
        </div>
        <div class="pokemon-id" >
            <span>#${pokemonInfo.id}</span>
        </div>
    </div>
    <div class="modal-bottom">
        <div class="div-img" >
            <img class="image" src="${pokemonInfo.sprites.other.dream_world.front_default}" alt="">
        </div>
        <h3>About</h3>
        <div class="pokemon-info" >
            <div class="info" >
                <p>Height</p>
                <p>Weight</p>
                <p>Abilities</p>
            </div>
            <div>
                <p>${pokemonInfo.height*10}cm</p>
                <p>${pokemonInfo.weight/10}kg</p>
                <p>${abilitiesConcat}</p>
            </div>
           
        </div>
        <h3>Breeding</h3>
        <div class="pokemon-info" >
            <div class="info" >
                <p>Gender</p>
                <p>Eggg Groups</p>
            </div>
            <div>
                <p>Female ${percentRateFemale}% Male ${percentRateMale}% </p>
                <p>${eggGroup}</p>
            </div>
        </div>
       
    </div>
</div>`;
}

function concatList(list){

    return stringConcat;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml       
    }).then(() => {
        document.querySelectorAll('button').forEach(function(botao) {
            botao.addEventListener('click', function() {
                if(this.id !== 'loadMoreButton'){
                    var idDoBotaoClicado = this.id;
                    pokeApi.getSpecificPokemon(idDoBotaoClicado).then( (pokemonInfo) => {
                       pokeApi.getSpeciesInfo(idDoBotaoClicado).then( (speciesInfo) => {
                        const genderRate = speciesInfo.gender_rate;           
                        const eggGroup = speciesInfo.egg_groups.map(objeto => objeto.name).join(', ');            
                        const abilities = pokemonInfo.abilities.map(objeto => objeto.ability.name).join(', ');
                        const type = pokemonInfo.types[0].type.name;
                        let modalContent = mountModal(type, pokemonInfo, abilities, genderRate, eggGroup, pokemonInfo.types);
                        modalPokemon.innerHTML = modalContent;
                        
                       } )
                    } ) 
                }
                
            });
          });
    })
}



loadPokemonItens(offset, limit)


loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})


